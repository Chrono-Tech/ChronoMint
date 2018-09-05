/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import {
  ErrorNoticeModel,
  TransferNoticeModel,
  TxExecModel,
} from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSelectedNetwork } from '../persistAccount/selectors'
import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import { pendingEntrySelector, getBtcSigner } from './selectors'
import { notify } from '../notifier/actions'
import BitcoinMiddlewareService from './BitcoinMiddlewareService'

export const executeBitcoinTransaction = ({ tx, options = null }) => async (dispatch, getState) => {
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
  const signer = getBtcSigner(state)
  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(getState())

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
  const signedEntry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(getState())

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
    const network = getSelectedNetwork()(getState())
    const unsignedTxHex = entry.tx.prepared.buildIncomplete().toHex()
    const signedHex = signer.signTransaction(unsignedTxHex)

    const txb = new bitcoin.TransactionBuilder
      .fromTransaction(bitcoin.Transaction.fromHex(signedHex), bitcoin.networks[network[entry.blockchain]])

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

  const state = getState()
  // eslint-disable-next-line
  entry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(state)
  const network = getSelectedNetwork()(state)
  if (!entry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }

  try {
    const res = await BitcoinMiddlewareService.send(entry.tx.signed.toHex(), { blockchain: entry.blockchain, type: network[entry.blockchain] })

    if (res && res.hash) {
      dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
        ...entry,
        tx: {
          ...entry.tx,
          isSent: true,
          isMined: false,
          hash: res.hash,
        },
      })))

      dispatch(notifyBitcoinTransfer(entry))
    }

    if (res && res.code === 0) {
      dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
        ...entry,
        tx: {
          ...entry.tx,
          isErrored: true,
          error: res.message,
        },
      })))
      dispatch(notifyBitcoinError(res))
    }

  } catch (e) {
    dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
    })))
    return null
  }
}

const notifyBitcoinTransfer = (entry) => (dispatch, getState) => {
  const { tx } = entry
  const token = getToken(entry.symbol)(getState())

  dispatch(notify(new TransferNoticeModel({
    value: token.removeDecimals(tx.amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

const notifyBitcoinError = (e) => notify(new ErrorNoticeModel({ message: e.message }))
