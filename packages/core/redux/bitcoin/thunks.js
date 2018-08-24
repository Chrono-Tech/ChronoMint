/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import type BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { TxEntryModel, TxExecModel } from '../../models'
import { getBtcFee, getProviderByBlockchain } from '../tokens/utils'
import TransferExecModel from '../../models/TransferExecModel'
import Amount from '../../models/Amount'
import { notifyError } from '../notifier/actions'
import TransferError from '../../models/TransferError'
import { TRANSFER_CANCELLED } from '../../models/constants/TransferError'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSigner } from '../persistAccount/selectors'

export const executeTransaction = ({ tx, options = null }) => async (dispatch, getState) => {

  console.log('before updateTx', tx)

  const updatedTx = await dispatch(prepareTransaction(tx, options))

  const entry = new TxEntryModel({
    key: uuid(),
    tx: updatedTx,
    receipt: null,
    isSubmitted: true,
    isAccepted: false,
  })

  dispatch(BitcoinActions.createTransaction(entry))

  console.log('updateTx', entry)

  dispatch(submitTransaction(entry))
}

export const prepareTransaction = (tx, {
  feeMultiplier = 1,
  satPerByte = null,
  wallet,
  token,
}) => async () => {
  const tokenRate = satPerByte ? satPerByte : tx.token.feeRate()

  const fee = await getBtcFee({
    address: tx.from,
    recipient: tx.to,
    amount: tx.value,
    formFee: tokenRate,
    blockchain: wallet.blockchain
  })

  return new TxExecModel({
    title: `tx.Bitcoin.${wallet.blockchain}.transfer.title`,
    blockchain: wallet.blockchain,
    from: tx.from,
    to: tx.to,
    amount: new Amount(tx.value, token.symbol()),
    amountToken: token,
    fee: new Amount(fee, token.symbol()),
    feeToken: token,
    feeMultiplier,
    options: {
      advancedParams: {
        satPerByte,
      }

    }
  })
}

const submitTransaction = (entry: TxEntryModel) => async (dispatch) => {
  dispatch(modalsOpen({
    componentName: 'ConfirmTransferDialog',
    props: {
      entry,
      confirm: (entry) => dispatch(acceptTransaction(entry)),
      reject: (entry) => dispatch(rejectTransaction(entry)),
    },
  }))
}

const acceptTransaction = (entry: TxEntryModel) => async (dispatch, getState) => {
  dispatch(BitcoinActions.acceptTransaction(entry))

  dispatch(processTransaction(entry))
}

const rejectTransaction = (entry: TxEntryModel) => (dispatch) => {
  dispatch(BitcoinActions.rejectTransaction(entry))

  const e = new TransferError('Rejected', TRANSFER_CANCELLED)

  dispatch(notifyError(e, entry.tx.funcTitle()))
}

const processTransaction = (entry: TxEntryModel) => async (dispatch, getState) => {
  const state = getState()
  const { amount, from, to, fee, blockchain } = entry.tx
  const { network } = getCurrentNetworkSelector(state)
  const decryptedWallet = getSigner(state)
  let privateKey = decryptedWallet.privateKey

  if (privateKey.slice(0, 2) === '0x') {
    privateKey = privateKey.slice(2)
  }

  console.log('processTransaction', privateKey, network)
  const engine = BitcoinUtils.getEngine(network, blockchain, privateKey)
  console.log('processTransaction:engine', engine)
  const utxos = await engine.node.getAddressUTXOS(from)
  const options = {
    from,
    blockchain,
    engine,
    feeRate: fee,
  }
  const { tx } = await dispatch(createTransaction(to, amount, utxos, options))
  console.log('createTx', tx, entry)
  return engine.node.send(from, tx.toHex())

}

const createTransaction = (to, amount: BigNumber, utxos, options) => async (dispatch) => {
  const { from, feeRate, engine } = options
  const { inputs, outputs, fee } = BitcoinUtils.describeTransaction(to, amount, feeRate, utxos)

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

  engine.signTransaction(txb, inputs)

  const buildTransaction = await txb.build()
  console.log('en', engine, txb, buildTransaction, inputs, outputs, fee)

  return {
    tx: buildTransaction,
    fee,
  }
}
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
