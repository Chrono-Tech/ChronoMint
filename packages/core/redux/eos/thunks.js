/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { modalsOpen } from '@chronobank/core/redux/modals/actions'
// import { /*, ErrorNoticeModel, TransferNoticeModel*/ } from '../../models'
import Eos from 'eosjs'
import { eosPendingEntrySelector, EOSPendingSelector, EOSSelector, getEosSigner, getEOSWallet } from './selectors/mainSelectors'
import { describePendingEosTx } from '../../describers'
// import { getAccount } from '../session/selectors/models'
import * as EosActions from './actions'
import * as EosUtils from './utils'
// import { getToken } from '../tokens/selectors'
import WalletModel from '../../models/wallet/WalletModel'
import { BLOCKCHAIN_EOS } from './constants'
import Amount from '../../models/Amount'
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
  const pending = EOSPendingSelector()(getState())
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

export const executeEosTransaction = (wallet, amount, to, memo = '') => async (dispatch) => {
  const tx = {
    from: wallet.address,
    amount,
    to,
    memo,
  }
  const entry = EosUtils.createEosTxEntryModel({ tx })
  await dispatch(EosActions.eosTxCreate(entry))
  dispatch(submitTransaction(entry))
}

const processTransaction = ({ entry }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry }))
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

const signTransaction = ({ entry }) => async (dispatch, getState) => {
  try {
    const state = getState()
    const signer = getEosSigner(state)
    const preparedTx = await EosUtils.prepareTransactionToOfflineSign(entry.tx)

    // sign
    const signedTx = await signer.signTransaction(preparedTx)

    dispatch(EosActions.eosTxUpdate(entry.key, entry.tx.from, EosUtils.createEosTxEntryModel({
      ...entry,
      tx: { ...entry.tx },
      signedTx,
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

  try {
    const httpEndpoint = 'https://api.jungle.alohaeos.com:443'
    const chainId = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
    const eos = Eos({ httpEndpoint, chainId }) // create eos read-only instance
    await eos.pushTransaction(entry.signedTx.transaction)
    // TODO implement callback after send
    // TODO @abdulov remove console.log
    // console.log('%c res', 'background: #222; color: #fff', res)
  } catch (e) {
    // TODO implement error notifier
    // console.error(e)
  }

  // if (res && res.meta && res.meta.hash) {
  //   const hash = res.meta.hash.data
  //   dispatch(eosTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: true, hash }))
  //   dispatch(notifyEosTransfer(entry))
  // }
  //
  // if (res.code === 0) {
  //   dispatch(eosTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
  //   dispatch(notifyEosError(res))
  // }
}

const submitTransaction = (entry) => async (dispatch) => {
  const description = describePendingEosTx(entry)

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
  const selectedEntry = eosPendingEntrySelector(entry.tx.from, entry.key)(getState())
  return dispatch(processTransaction({
    entry: selectedEntry,
  }))
}

const rejectTransaction = (entry) => (dispatch) => dispatch(eosTxStatus(entry.key, entry.tx.from, { isRejected: true }))

export const initEos = () => async (dispatch) => {
  dispatch(createEosWallet())
  dispatch(setEos())
  await dispatch(getAccountBalances('chronobank13'))
}

export const createEosWallet = () => (dispatch) => {
  dispatch(EosActions.updateWallet(new WalletModel({
    address: 'chronobank13',
    blockchain: BLOCKCHAIN_EOS,
    isMain: true,
  })))
}

export const getAccountBalances = (account) => async (dispatch, getState) => {
  try {
    const state = getState()
    const eos = EOSSelector(state)
    const wallet = getEOSWallet(`${BLOCKCHAIN_EOS }-${account}`)(state)
    const result = await eos.getCurrencyBalance('eosio.token', account)
    if (Array.isArray(result)) {
      const balances = result.reduce((accumulator, balance) => {
        const [value, symbol] = balance.split(' ')
        return {
          ...accumulator,
          [symbol]: new Amount(value, symbol),
        }
      }, {})

      dispatch(EosActions.updateWallet(new WalletModel({ ...wallet, balances })))
    }
  } catch (e) {
    // TODO @abdulov remove console.log
    // eslint-disable-next-line
    console.log(e)
  }

}

export const setEos = () => async (dispatch) => {
  try {
    const httpEndpoint = 'https://api.jungle.alohaeos.com:443'
    const chainId = '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
    const eos = Eos({ httpEndpoint, chainId }) // create eos read-only instance
    dispatch(EosActions.updateEos(eos))
  } catch (e) {
    // TODO implement reaction somehow
    // eslint-disable-next-line
    console.log('%c e', 'background: #222; color: #fff', e)
  }
}
