/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import BigNumber from 'bignumber.js'
// import bitcoin from 'bitcoinjs-lib'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
// import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { TxEntryModel, TxExecModel } from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { /*getSelectedNetwork,*/ getSigner } from '../persistAccount/selectors'
import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import SignerMemoryModel from '../../models/SignerMemoryModel'
import { pendingEntrySelector } from './selectors'

export const executeBitccoinTransaction = ({ tx, options = null }) => async (dispatch) => {
  const prepared = await dispatch(prepareTransaction(tx, options))
  const entry = new TxEntryModel({
    key: uuid(),
    tx: prepared,
    symbol: options.symbol,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
  })

  dispatch(BitcoinActions.createTransaction(entry))
  dispatch(submitTransaction(entry))
}

export const prepareTransaction = (tx, { feeMultiplier = 1, satPerByte = null, symbol }) => async (dispatch, getState) => {
  const state = getState()
  const token = getToken(symbol)(state)
  const tokenRate = satPerByte ? satPerByte : token.feeRate()
  // const network = getSelectedNetwork()(state)
  // const prepared = BitcoinUtils.describeBitcoinTransaction(
  //   tx.to,
  //   tx.value,
  //   {
  //     from: tx.from,
  //     feeRate: new BigNumber(tokenRate).mul(feeMultiplier),
  //     blockchain: token.blockchain(),
  //     network,
  //   })

  const fee = await BitcoinUtils.getBtcFee({
    address: tx.from,
    recipient: tx.to,
    amount: tx.value,
    formFee: new BigNumber(tokenRate).mul(feeMultiplier),
    blockchain: token.blockchain(),
  })

  return new TxExecModel({
    from: tx.from,
    to: tx.to,
    amount: new BigNumber(tx.value),
    fee: new BigNumber(fee),
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

const rejectTransaction = (entry) => (dispatch) => dispatch(BitcoinActions.rejectTransaction(entry))

const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  const signedEntry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
  if (!signedEntry) {
    // eslint-disable-next-line no-console
    console.error('signedEntry is null', entry)
    return // stop execute
  }
  // return dispatch(sendSignedTransaction({
  //   entry: signedEntry,
  // }))
}

const signTransaction = (/*{ entry, signer }*/) => async (/*dispatch, getState*/) => {
  /*
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
  */
}

/*
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
*/

/*
const createTransaction = (to, amount: BigNumber, utxos, options) => async () => {
  const { from, feeRate, engine } = options
  const { inputs, outputs, fee } = BitcoinUtils.describeTransaction(to, amount, feeRate, utxos)
  const signer = engine.wallet

  if (!inputs || !outputs) throw new Error('Bad transaction data')

  const txb = new bitcoin.TransactionBuilder(engine.network)
  for (const input of inputs) {
    txb.addInput(input.txId, input.vout)
  }

  for (const output of outputs) {
    if (!output.address) {
      output.address = from
    }
    txb.addOutput(output.address, output.value)
  }

  engine.signTransaction(txb, inputs, signer.keyPair)

  const buildTransaction = await txb.build()

  return {
    tx: buildTransaction,
    fee,
  }
}
*/

/*
export const processTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  await dispatch(signTransaction({ entry, signer }))
  return dispatch(sendSignedTransaction({
    entry: pendingEntrySelector(entry.tx.from, entry.key)(getState()),
  }))
}

export const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  try {
    const { tx } = entry
    const signed = Utils.createXemTransaction(tx.prepared, signer, getSelectedNetwork()(getState()))
    dispatch(Actions.nemTxUpdate(entry.key, entry.tx.from, new TxEntryModel({
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
export const sendSignedTransaction = ({ entry }) => async (dispatch, getState) => {
  dispatch(nemTxStatus(entry.key, entry.tx.from, { isPending: true }))
  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key)(getState())
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
*/
