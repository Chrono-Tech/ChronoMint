/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as BtcConstants from './constants'

export const bitcoinTxUpdate = (entry) => ({
  type: BtcConstants.BITCOIN_TX_UPDATE,
  key: entry.key,
  address: entry.tx.from,
  entry,
})

export const bitcoinTxAccept = (entry) => ({
  type: BtcConstants.BITCOIN_TX_ACCEPT,
  entry,
  isAccepted: true,
  isPending: true,
})

export const bitcoinTxReject = (entry) => ({
  type: BtcConstants.BITCOIN_TX_REJECT,
  entry,
  isRejected: true,
})

export const bitcoinHttpGetUtxos = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS,
})

export const bitcoinHttpGetUtxosSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS_SUCCESS,
  data,
})

export const bitcoinHttpGetUtxosFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_UTXOS_FAILURE,
  error,
})

export const bitcoinHttpGetBlocksHeight = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT,
})

export const bitcoinHttpGetBlocksHeightSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT_SUCCESS,
  data,
})

export const bitcoinHttpGetBlocksHeightFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT_FAILURE,
  error,
})

export const bitcoinHttpGetTransactionInfo = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_INFO,
})

export const bitcoinHttpGetTransactionInfoSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_INFO_SUCCESS,
  data,
})

export const bitcoinHttpGetTransactionInfoFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_INFO_FAILURE,
  error,
})

export const bitcoinHttpGetTransactionList = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_LIST,
})

export const bitcoinHttpGetTransactionListSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_LIST_SUCCESS,
  data,
})

export const bitcoinHttpGetTransactionListFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_TX_LIST_FAILURE,
  error,
})

export const bitcoinHttpGetAddressInfo = () => ({
  type: BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO,
})

export const bitcoinHttpGetAddressInfoSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO_SUCCESS,
  data,
})

export const bitcoinHttpGetAddressInfoFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO_FAILURE,
  error,
})

export const bitcoinHttpPostSendTx = () => ({
  type: BtcConstants.BITCOIN_HTTP_POST_SEND_TX,
})

export const bitcoinHttpPostSendTxSuccess = (data) => ({
  type: BtcConstants.BITCOIN_HTTP_POST_SEND_TX_SUCCESS,
  data,
})

export const bitcoinHttpPostSendTxFailure = (error) => ({
  type: BtcConstants.BITCOIN_HTTP_POST_SEND_TX_FAILURE,
  error,
})
