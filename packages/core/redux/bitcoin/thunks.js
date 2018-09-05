/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import type { Dispatch } from 'redux'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import {
  TransferNoticeModel,
} from '../../models'
import * as BitcoinActions from './actions'
import * as BitcoinUtils from './utils'
import { getSelectedNetwork } from '../persistAccount/selectors'
import { describePendingBitcoinTx } from '../../describers'
import { getToken } from '../tokens/selectors'
import { notify, notifyError } from '../notifier/actions'
import BitcoinMiddlewareService from './BitcoinMiddlewareService'
import { pendingEntrySelector, getBitcoinSigner } from './selectors'

    const prepared = BitcoinUtils.prepareBitcoinTransaction(tx, token, network, utxos)
/**
 * Start sending transaction. It will be signed and sent.
 * @param {tx} - Object {from, to, value}
 * @param {options} - Object {feeMultiplier, walletDerivedPath, symbol, advancedParams}
 *   advancedParams is Object {satPerByte, mode}
 *   mode is 'advanced'|'simple' (manual or automatic fee)
 * @return {undefined}
 */
export const executeBitcoinTransaction = ({ tx, options = {} }) => async (dispatch, getState) => {
  const state = getState()
  const token = getToken(options.symbol)(state)
  const blockchain = token.blockchain()
  const network = getSelectedNetwork()(state)
  try {
    const utxos = await dispatch(getAddressUTXOS(tx.from, blockchain))
    const prepared = await dispatch(BitcoinUtils.prepareBitcoinTransaction(tx, token, network, utxos))
    const entry = BitcoinUtils.createBitcoinTxEntryModel({
      tx: prepared,
      blockchain,
    }, options)

    dispatch(BitcoinActions.bitcoinTxUpdate(entry))
    dispatch(submitTransaction(entry))
  } catch (error) {
    // And what to do now?
    // eslint-disable-next-line no-console
    console.log('Can\'t get utxos.', error)
  }
}

// TODO: dispatch(setLatestBlock(blockchain, { blockNumber: data.currentBlock }))
// in appropriate place
export const getCurrentBlockHeight = (blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain) {
    const error = new Error('Malformed request. "blockchain" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetBlocksHeight())
  return BitcoinMiddlewareService.requestCurrentBlockHeight({ blockchain, type: netType })
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetBlocksHeightFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getTransactionInfo = (txid: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !txid) {
    const error = new Error('Malformed request. "blockchain" and "txid" must be non-empty string')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetTransactionInfo())
  return BitcoinMiddlewareService.requestBitcoinTransactionInfo({ blockchain, type: netType })
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionInfoFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getTransactionsList = (address: string, id, skip = 0, offset = 0, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address || !id) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetTransactionListFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const networkType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetTransactionList())
  return BitcoinMiddlewareService.requestBitcoinTransactionsList(address, id, skip, offset, blockchain, networkType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionListSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetTransactionListFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getAddressInfo =  (address: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetAddressInfoFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetAddressInfo())
  return BitcoinMiddlewareService.requestBitcoinAddressInfo(address, blockchain, netType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetAddressInfoSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetAddressInfoFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
    })
}

export const getAddressUTXOS = (address: string, blockchain: string) => (dispatch: Dispatch<any>, getState): Promise<*> => {
  if (!blockchain || !address) {
    const error = new Error('Malformed request. blockchain and/or address must be non-empty strings')
    dispatch(BitcoinActions.bitcoinHttpGetUtxosFailure(error))
    return Promise.reject(error)
  }

  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const netType = network[blockchain]

  dispatch(BitcoinActions.bitcoinHttpGetUtxos())
  return BitcoinMiddlewareService.requestBitcoinAddressUTXOS(address, blockchain, netType)
    .then((response) => {
      dispatch(BitcoinActions.bitcoinHttpGetUtxosSuccess(response.data))
      // TODO: need to check that res.status is equal 200 etc. Or it is better to check right in fetchPersonInfo.
      return response.data // TODO: to verify, that 'data' is JSON, not HTML like 502.html or 404.html
    })
    .catch((error) => {
      dispatch(BitcoinActions.bitcoinHttpGetUtxosFailure(error))
      throw new Error(error) // Rethrow for further processing, for example by SubmissionError
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
      reject: (entry) => (dispatch) => dispatch(BitcoinActions.bitcoinTxReject(entry)),
    },
  }))
}

const acceptTransaction = (entry) => async (dispatch, getState) => {
  dispatch(BitcoinActions.bitcoinTxAccept(entry))

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

    if (typeof signInputs === 'function') {
      const network = getSelectedNetwork()(state)
      const pk = signer.privateKey.substring(2, 66) // remove 0x
      const bitcoinNetwork = bitcoin.networks[network[entry.blockchain]]
      // TODO: do we really need to create new wallet? maybe bitcore or other lib has appropriate method?
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
      dispatch(notifyBitcoinError(res, 'Bitcoin: sendSignedTransaction'))
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

const notifyBitcoinError = (e, invoker) => notifyError(e, invoker)

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
