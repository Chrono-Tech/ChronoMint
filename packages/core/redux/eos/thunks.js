/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from '@chronobank/core/redux/modals/actions'
import { SignerMemoryModel/*, ErrorNoticeModel, TransferNoticeModel*/ } from '../../models'
import { eosPendingSelector, eosPendingEntrySelector } from './selectors'
import { getSelectedNetwork, getSigner } from '../persistAccount/selectors'
import { describePendingEosTx } from '../../describers'
import { getAccount } from '../session/selectors/models'
import * as EosActions from './actions'
import * as EosUtils from './utils'
import { getToken } from '../tokens/selectors'
// import { notify } from '../notifier/actions'

/*
const notifyEosTransfer = (entry) => (dispatch, getState) => {
  const { tx } = entry
  const { prepared } = tx
  const token = getToken(entry.symbol)(getState())

  const amount = prepared.amount

  dispatch(notify(new TransferNoticeModel({
    amount: token.removeDecimals(amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

const notifyEosError = (e) => notify(new ErrorNoticeModel({ message: e.message }))
*/

const eosTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = eosPendingSelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }

  return dispatch(EosActions.eosTxUpdate(
    key,
    address,
    EosUtils.createEosTxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const executeEosTransaction = ({ tx, options }) => async (dispatch) => {
  const prepared = await dispatch(prepareTransaction({ tx, options }))
  const entry = EosUtils.createEosTxEntryModel({ tx: prepared }, options)

  await dispatch(EosActions.eosTxCreate(entry))
  dispatch(submitTransaction(entry, options))
}

const prepareTransaction = ({ tx }) => async (dispatch, getState) => {
  const network = getSelectedNetwork()(getState())
  return EosUtils.describeEosTransaction(tx, network)
}

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  const signedEntry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
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
    const signed = EosUtils.createEosTransaction(tx.prepared, signer, getSelectedNetwork()(getState()))
    dispatch(EosActions.eosTxUpdate(entry.key, entry.tx.from, EosUtils.createEosTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed,
      },
    })))

  } catch (error) {
    dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error }))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(eosTxStatus(entry.key, entry.tx.from, { isPending: true }))

  // eslint-disable-next-line
  entry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  // TODO implement node
  // const res = await node.send({ ...entry.tx.signed.tx, fee: entry.tx.signed.fee })

  /*if (res && res.meta && res.meta.hash) {
    const hash = res.meta.hash.data
    dispatch(eosTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: true, hash }))
    dispatch(notifyEosTransfer(entry))
  }

  if (res.code === 0) {
    dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
    dispatch(notifyEosError(res))
  }*/
}

const submitTransaction = (entry) => async (dispatch, getState) => {

  const state = getState()
  const account = getAccount(state)

  const description = describePendingEosTx(
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
  dispatch(eosTxStatus(entry.key, entry.tx.from, { isAccepted: true, isPending: true }))

  const state = getState()
  let signer = getSigner(state)
  if (entry.walletDerivedPath) {
    signer = await SignerMemoryModel.fromDerivedPath({
      seed: signer.privateKey,
      derivedPath: entry.walletDerivedPath,
    })
  }

  const selectedEntry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
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

const rejectTransaction = (entry) => (dispatch) => dispatch(eosTxStatus(entry.key, entry.tx.from, { isRejected: true }))
