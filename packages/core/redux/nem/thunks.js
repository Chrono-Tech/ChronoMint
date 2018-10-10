/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { nemProvider } from '@chronobank/login/network/NemProvider'
import { modalsOpen } from '../../redux/modals/actions'
import { ErrorNoticeModel, TransferNoticeModel } from '../../models'
import { nemPendingSelector, pendingEntrySelector, getNemSigner } from './selectors'
import { getSelectedNetwork } from '../persistAccount/selectors'
import { describePendingNemTx } from '../../describers'
import { getAccount } from '../session/selectors/models'
import * as NemActions from './actions'
import * as NemUtils from './utils'
import { getToken } from '../tokens/selectors'
import { notify } from '../notifier/actions'
import tokenService from '../../services/TokenService'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'
import { showSignerModal, closeSignerModal } from '../modals/thunks'

const notifyNemTransfer = (entry) => (dispatch, getState) => {
  const { tx } = entry
  const { prepared } = tx
  const token = getToken(entry.symbol)(getState())

  const amount = prepared.mosaics
    ? prepared.mosaics[0].quantity  // we can send only one mosaic
    : prepared.amount

  dispatch(notify(new TransferNoticeModel({
    amount: token.removeDecimals(amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

const notifyNemError = (e) => notify(new ErrorNoticeModel({ message: e.message }))

const nemTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = nemPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }

  return dispatch(NemActions.nemTxUpdate(
    key,
    address,
    NemUtils.createNemTxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const estimateNemFee = (params) => async (dispatch) => {
  const { from, to, amount } = params
  const nemDao = tokenService.getDAO(amount.symbol())
  const tx = nemDao.transfer(from, to, amount)
  const preparedTx = await dispatch(prepareTransaction({ tx }))

  return NemUtils.formatFee(preparedTx.prepared.fee)
}

export const executeNemTransaction = ({ tx, options }) => async (dispatch) => {
  dispatch(NemActions.nemExecuteTx({ tx, options }))
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = NemUtils.createNemTxEntryModel({ tx: prepared }, options)

  await dispatch(NemActions.nemTxCreate(entry))
  dispatch(submitTransaction(entry))
}

const prepareTransaction = ({ tx }) => async (dispatch, getState) => {
  dispatch(NemActions.nemPrepareTx({ tx }))

  const network = getSelectedNetwork()(getState())
  return tx.mosaicDefinition
    ? NemUtils.describeMosaicTransaction(tx, network)
    : NemUtils.describeXemTransaction(tx, network)
}

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  dispatch(NemActions.nemProcessTx({ entry, signer }))

  await dispatch(signTransaction({ entry, signer }))
  const signedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!signedEntry) {
    // eslint-disable-next-line no-console
    console.error('signedEntry is null', entry)
    return // stop execute
  }
  return dispatch(sendSignedTransaction({
    entry: signedEntry,
  }))
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

    dispatch(NemActions.nemTxSignTransaction({ entry, signer }))

    dispatch(showSignerModal())
    const { tx } = entry
    const signed = await NemUtils.createXemTransaction(tx.prepared, signer, selectedWallet.encrypted[0].path)
    dispatch(closeSignerModal())

    dispatch(NemActions.nemTxUpdate(entry.key, entry.tx.from, NemUtils.createNemTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed,
      },
    })))

  } catch (error) {
    dispatch(closeSignerModal())

    dispatch(NemActions.nemTxSignTransactionError({ error }))
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(NemActions.nemTxSendSignedTransaction({ entry }))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  const node = nemProvider.getNode()
  const res = await node.send({ ...entry.tx.signed.tx, fee: entry.tx.signed.fee }) || {}

  if (res.meta && res.meta.hash) {
    const hash = res.meta.hash.data
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: true, hash }))
    dispatch(notifyNemTransfer(entry))
  }

  if (res.code === 0) {
    dispatch(NemActions.nemTxSendSignedTransactionError({ entry, res }))
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
    dispatch(notifyNemError(res))
  }
}

const submitTransaction = (entry) => async (dispatch, getState) => {
  dispatch(NemActions.nemSubmitTx({ entry }))

  const state = getState()
  const account = getAccount(state)

  const description = describePendingNemTx(
    entry,
    {
      address: account,
      token: getToken(entry.symbol)(state),
    })

  dispatch(modalsOpen({
    componentName: 'ConfirmTxDialog',
    props: {
      entry,
      description,
      accept: acceptTransaction,
      reject: rejectTransaction,
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(NemActions.nemTxAccept(entry))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  const signer = getNemSigner(state)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return
  }

  return dispatch(processTransaction({
    entry: selectedEntry,
    signer,
  }))
}

const rejectTransaction = (entry) => (dispatch) => {
  dispatch(NemActions.nemRejectTx({ entry }))
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isRejected: true }))
}
