/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import type { Dispatch } from 'redux'
import * as BitcoinMiddlewaresAPI from '@chronobank/nodes/httpNodes/api/chronobankNodes/bitcoins'
import { modalsOpen, modalsClose } from '../modals/actions'
import {
  TransferNoticeModel,
} from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSelectedNetwork } from '../persistAccount/selectors'

import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import { pendingEntrySelector, getBitcoinSigner } from './selectors'
import { notify, notifyError } from '../notifier/actions'

/**
 * Start sending transaction. It will be signed and sent.
 * @param {tx} - Object {from, to, value}
 * @param {options} - Object {feeMultiplier, walletDerivedPath, symbol, advancedParams}
 *   advancedParams is Object {satPerByte, mode}
 *   mode is 'advanced'|'simple' (manual or automatic fee)
 * @return {undefined}
 */
export const executeBitcoinTransaction = ({ tx, options = {} }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinExecuteTx())
  try {
    const state = getState()
    const token = getToken(options.symbol)(state)
    const blockchain = token.blockchain()
    const network = getSelectedNetwork()(state)
    const utxos = await dispatch(getAddressUTXOS(tx.from, blockchain))
    const prepared = await dispatch(BitcoinUtils.prepareBitcoinTransaction(tx, token, network, utxos))
    const entry = BitcoinUtils.createBitcoinTxEntryModel({
      tx: prepared,
      blockchain,
    }, options)
    dispatch(BitcoinActions.bitcoinTxUpdate(entry))
    dispatch(submitTransaction(entry))
  } catch (error) {
    dispatch(BitcoinActions.bitcoinExecuteTxFailure(error))
  }
}

// TODO: dispatch(setLatestBlock(blockchain, { blockNumber: data.currentBlock }))
// in appropriate place
export const getCurrentBlockHeight = (blockchain: string) => (dispatch: Dispatch<any>): Promise<*> => {
  if (!blockchain) {
    const error = new Error('Malformed request. "blockchain" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightFailure(error))
    return Promise.reject(error)
  }

  return dispatch(BitcoinMiddlewaresAPI.requestBlocksHeight(blockchain))
}

export const getTransactionInfo = (txid: string, blockchain: string) => (dispatch: Dispatch<any>): Promise<*> => {
  if (!blockchain || !txid) {
    const error = new Error('Malformed request. "blockchain" and "txid" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoFailure(error))
    return Promise.reject(error)
  }

  return dispatch(BitcoinMiddlewaresAPI.requestBitcoinTransactionByHash(blockchain, txid))
}

export const getTransactionsList = (address: string, id, skip, offset, blockchain: string) => (dispatch: Dispatch<any>): Promise<*> => {
  if (!blockchain || !address || !id) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionListFailure(error))
    return Promise.reject(error)
  }

  return dispatch(BitcoinMiddlewaresAPI.requestBitcoinTransactionsHistoryByAddress(blockchain, address, skip, offset))
}

export const getAddressInfo =  (address: string, blockchain: string) => async (dispatch: Dispatch<any>): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetAddressInfoFailure(error))
    return Promise.reject(error)
  }

  return dispatch(BitcoinMiddlewaresAPI.requestBitcoinBalanceByAddress(blockchain, address))
}

export const getAddressUTXOS = (address: string, blockchain: string) => (dispatch: Dispatch<any>): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetUtxosFailure(error))
    return Promise.reject(error)
  }

  return dispatch(BitcoinMiddlewaresAPI.requestBitcoinUtxoByAddress(blockchain, address))
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
      reject: (entry) => (dispatch) => dispatch(BitcoinActions.bitcoinTxReject(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinTxAccept(entry))

  const state = getState()
  const signer = getBitcoinSigner(state, entry.blockchain)

  const selectedEntry = pendingEntrySelector(entry.tx.from, entry.key, entry.blockchain)(state)

  if (!selectedEntry) {
    // eslint-disable-next-line no-console
    console.error('entry is null', entry)
    return // stop execute
  }
  try {
    return dispatch(processTransaction({
      entry: selectedEntry,
      signer,
    }))
  } catch (error) {
    throw error
  }
}

const processTransaction = ({ entry, signer }) => async (dispatch) => {
  try {
    const signedEntry = await dispatch(signTransaction({ entry, signer }))
    if (!signedEntry) {
      // eslint-disable-next-line no-console
      console.error('signedEntry is null', entry)
      return null // stop execute
    }
    return dispatch(sendSignedTransaction(signedEntry))
  } catch (error) {
    throw error
  }
}

const signTransaction = ({ entry, signer }) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinSignTx())
  try {
    const network = getSelectedNetwork()(getState())
    const unsignedTxHex = entry.tx.prepared.buildIncomplete().toHex()
    if (signer.isActionRequestedModalDialogShows()) {
      dispatch(BitcoinActions.bitcoinShowSignTxConfirmationModalDialog())
      dispatch(modalsOpen({
        componentName: 'ActionRequestDeviceDialog',
      }))
    }
    const signedHex = await signer.signTransaction(unsignedTxHex)

    if (signer.isActionRequestedModalDialogShows()) {
      dispatch(BitcoinActions.bitcoinCloseSignTxConfirmationModalDialog())
      dispatch(modalsClose({
        componentName: 'ActionRequestDeviceDialog',
      }))
    }
    const bitcoinTransaction = bitcoin.Transaction.fromHex(signedHex)
    const bitcoinNetwork = bitcoin.networks[network[entry.blockchain]]
    const txb = new bitcoin.TransactionBuilder.fromTransaction(bitcoinTransaction, bitcoinNetwork)
    const bitcoinTxEntry = BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      tx: {
        ...entry.tx,
        signed: txb.build(),
      },
    })

    dispatch(BitcoinActions.bitcoinTxUpdate(bitcoinTxEntry))
    dispatch(BitcoinActions.bitcoinSignTxSuccess(bitcoinTxEntry))
    return bitcoinTxEntry
  } catch (error) {
    if (signer.isActionRequestedModalDialogShows()) {
      dispatch(BitcoinActions.bitcoinCloseSignTxConfirmationModalDialog())
      dispatch(modalsClose({
        componentName: 'ActionRequestDeviceDialog',
      }))
    }
    const bitcoinErrorTxEntry = BitcoinUtils.createBitcoinTxEntryModel({
      ...entry,
      isErrored: true,
      error,
    })
    dispatch(BitcoinActions.bitcoinTxUpdate(bitcoinErrorTxEntry))
    dispatch(BitcoinActions.bitcoinSignTxFailure(error))
    throw error
  }
}

// TODO: need to continue rework of this method. Pushed to merge with other changes.
const sendSignedTransaction = (entry) => async (dispatch) => {
  if (!entry) {
    const error = new Error('Can\'t send empty Tx. There is no entry at BTC sendSignedTransaction')
    dispatch(BitcoinActions.bitcoinHttpPostSendTxFailure(error))
    throw new Error(error)
  }

  dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
    ...entry,
    isPending: true,
  })))

  const rawTx = entry.tx.signed.toHex()
  const blockchain = entry.blockchain

  return dispatch(BitcoinMiddlewaresAPI.requestBitcoinSendRawTransaction(blockchain, rawTx))
    .then((response) => {
      if (!response) {
        dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
          ...entry,
          isErrored: true,
        })))
        throw new Error('Incorrect response from server. Can\'t send transaction.')
      }

      if (response.data && response.data.code === 0) {
        dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
          ...entry,
          tx: {
            ...entry.tx,
            isErrored: true,
            error: response.data.message,
          },
        })))
        dispatch(notifyError(response.data, 'Bitcoin: sendSignedTransaction'))
      }

      if (response.data && response.data.hash) {
        const txEntry = BitcoinUtils.createBitcoinTxEntryModel({
          ...entry,
          tx: {
            ...entry.tx,
            isSent: true,
            isMined: false,
            hash: response.hash,
          },
        })

        dispatch(BitcoinActions.bitcoinTxUpdate(txEntry))
        dispatch(notifyBitcoinTransfer(txEntry))

        return response.data
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.log(error)
      dispatch(BitcoinActions.bitcoinTxUpdate(BitcoinUtils.createBitcoinTxEntryModel({
        ...entry,
        isErrored: true,
      })))
    })
}

const notifyBitcoinTransfer = (entry) => (dispatch, getState) => {
  const state = getState()
  const { tx } = entry
  const token = getToken(entry.symbol)(state)

  dispatch(notify(new TransferNoticeModel({
    value: token.removeDecimals(tx.amount),
    symbol: token.symbol(),
    from: entry.tx.from,
    to: entry.tx.to,
  })))
}

export const estimateBtcFee = (params, callback) => async (dispatch) => {
  const {
    address,
    recipient,
    amount,
    formFee,
    blockchain,
  } = params
  try {
    const utxos = await dispatch(getAddressUTXOS(address, blockchain))
    const fee = BitcoinUtils.getBtcFee(recipient, amount, formFee, utxos)
    callback(null, fee)
  } catch (e) {
    callback(e)
  }
}
