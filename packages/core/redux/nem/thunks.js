/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { ErrorNoticeModel, SignerMemoryModel, TransferNoticeModel } from '../../models'
import { nemPendingSelector, pendingEntrySelector } from './selectors'
import { getSelectedNetwork, getSigner } from '../persistAccount/selectors'
import { describePendingNemTx } from '../../describers'
import { getAccount } from '../session/selectors/models'
import * as NemActions from './actions'
import * as NemUtils from './utils'
import { getToken } from '../tokens/selectors'
import { notify } from '../notifier/actions'

const notifyNemTransfer = (entry) => (dispatch, getState) => {
  const { tx } = entry
  const { prepared } = tx
  const token = getToken(entry.symbol)(getState())

  const amount = prepared.mosaics
    ? prepared.mosaics[0].quantity  // we can send only one mosaic
    : prepared.amount

  dispatch(notify(new TransferNoticeModel({
    value: token.removeDecimals(amount),
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

export const executeNemTransaction = ({ tx, options }) => async (dispatch) => {
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = NemUtils.createNemTxEntryModel({ tx: prepared }, options)

  await dispatch(NemActions.nemTxCreate(entry))
  dispatch(submitTransaction(entry, options))
}

const prepareTransaction = ({ tx }) => async (dispatch, getState) => {
  const network = getSelectedNetwork()(getState())
  return tx.mosaicDefinition
    ? NemUtils.describeMosaicTransaction(tx, network)
    : NemUtils.describeXemTransaction(tx, network)
}

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
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
    const { tx } = entry
    const signed = NemUtils.createXemTransaction(tx.prepared, signer, getSelectedNetwork()(getState()))
    dispatch(NemActions.nemTxUpdate(entry.key, entry.tx.from, NemUtils.createNemTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed,
      },
    })))

  } catch (error) {
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  const node = nemProvider.getNode()
  const res = await node.send({ ...entry.tx.signed.tx, fee: entry.tx.signed.fee })

  if (res && res.meta && res.meta.hash) {
    const hash = res.meta.hash.data
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: true, hash }))
    dispatch(notifyNemTransfer(entry))
  }

  if (res.code === 0) {
    dispatch(nemTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
    dispatch(notifyNemError(res))
  }
}

const submitTransaction = (entry) => async (dispatch, getState) => {

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
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  let signer = getSigner(state)
  if (entry.walletDerivedPath) {
    signer = await SignerMemoryModel.fromDerivedPath({
      seed: signer.privateKey,
      derivedPath: entry.walletDerivedPath,
    })
  }

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  return dispatch(processTransaction({
    entry: selectedEntry,
    signer,
  }))
}

const rejectTransaction = (entry) => (dispatch) => dispatch(nemTxStatus(entry.key, entry.tx.from, { isRejected: true }))
