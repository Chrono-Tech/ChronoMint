/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import {
  TxExecModel,
  TransferNoticeModel,
  ErrorNoticeModel,
} from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSelectedNetwork, getSigner } from '../persistAccount/selectors'
import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import { pendingEntrySelector } from './selectors'
import { notify } from '../notifier/actions'

const bitcoinTxStatus = (key, address, props) => (dispatch, getState) => {
  const pending = pendingEntrySelector()(getState())
  const scope = pending[address]
  if (!scope) {
    return null
  }
  const entry = scope[key]
  if (!entry) {
    return null
  }

  return dispatch(BitcoinActions.bitcoinTxUpdate(
    key,
    address,
    BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      ...props,
    }),
  ))
}

export const executeBitccoinTransaction = ({ tx, options = null }) => async (dispatch, getState) => {
  const token = getToken(options.symbol)(getState())
  const prepared = await dispatch(prepareTransaction(tx, options))
  const entry = BitcoinUtils.createBitcoinTxEntryModel({
    tx: prepared,
    blockchain: token.blockchain(),
  }, options)

  dispatch(BitcoinActions.createTransaction(entry))
  dispatch(submitTransaction(entry))
}

export const prepareTransaction = (tx, { feeMultiplier = 1, satPerByte = null, symbol }) => async (dispatch, getState) => {
  const state = getState()
  const token = getToken(symbol)(state)
  const tokenRate = satPerByte ? satPerByte : token.feeRate()
  const network = getSelectedNetwork()(state)
  const prepared = await BitcoinUtils.describeBitcoinTransaction(
    tx.to,
    tx.value,
    {
      from: tx.from,
      feeRate: new BigNumber(tokenRate).mul(feeMultiplier),
      blockchain: token.blockchain(),
      network,
    })

  return new TxExecModel({
    from: tx.from,
    to: tx.to,
    amount: new BigNumber(tx.value),
    fee: new BigNumber(prepared.fee),
    prepared: prepared.tx,
    inputs: prepared.inputs,
    outputs: prepared.outputs,
  })
}

const submitTransaction = (entry) => async (dispatch, getState) => {

  const state = getState()

  const description = describePendingBitcoinTx(
    entry,
    {
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
  dispatch(BitcoinActions.acceptTransaction(entry))

  const state = getState()
  const signer = getSigner(state)

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

const rejectTransaction = (entry) => (dispatch) => dispatch(BitcoinActions.rejectTransaction(entry))

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  const signedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!signedEntry) {
    // eslint-disable-next-line no-console
    console.error('signedEntry is null', entry)
    return null // stop execute
  }
  return dispatch(sendSignedTransaction({
    entry: signedEntry,
  }))
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { tx } = entry
    const txb = tx.prepared
    const signInputs = BitcoinUtils.signInputsMap[entry.blockchain]
    const state = getState()

    if (typeof signInputs === 'function') {
      const network = getSelectedNetwork()(state)
      const pk = signer.privateKey.substring(2, 66) // remove 0x
      const bitcoinNetwork = bitcoin.networks[network[entry.blockchain]]
      const bitcoinSigner = BitcoinUtils.createBitcoinWalletFromPK(pk, bitcoinNetwork)
      signInputs(txb, tx.inputs, bitcoinSigner)
    }

    dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed: txb.build(),
      },
    })))
  } catch (error) {
    dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
      error,
    })))
    throw error
  }
}

const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
    ...entry,
    isPending: true,
  })))

  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  const node = BitcoinUtils.getNodeByBlockchain(entry.blockchain)
  if (!node) {
    dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
    })))
    return null
  }

  const res = await node.send(entry.tx.from, entry.tx.signed.toHex())

  if (res && res.hash) {
    dispatch(bitcoinTxStatus(entry.key, entry.tx.from, { isSent: true, isMined: false, hash: res.hash }))
    dispatch(notifyBitcoinTransfer(entry))
  }

  if (res.code === 0) {
    dispatch(bitcoinTxStatus(entry.key, entry.tx.from, { isErrored: true, error: res.message }))
    dispatch(notifyBitcoinError(res))
  }
}

const notifyBitcoinTransfer = (entry) => (dispatch, getState) => {
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

const notifyBitcoinError = (e) => notify(new ErrorNoticeModel({ message: e.message }))
