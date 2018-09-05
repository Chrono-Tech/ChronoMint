/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const DUCK_BITCOIN = 'bitcoin'

// Actions to operate with preparation of a transaction Create/update, accept before send or reject.
export const BITCOIN_TX_UPDATE = 'BITCOIN/TX/UPDATE'
export const BITCOIN_TX_ACCEPT = 'BITCOIN/TX/ACCEPT'
export const BITCOIN_TX_REJECT = 'BITCOIN/TX/REJECT'

// Get UTXOS (exits) for bitcoin-like blockchain
export const BITCOIN_HTTP_GET_UTXOS = 'BITCOIN/HTTP/GET_UTXOS'
export const BITCOIN_HTTP_GET_UTXOS_SUCCESS = 'BITCOIN/HTTP/GET_UTXOS_SUCCESS'
export const BITCOIN_HTTP_GET_UTXOS_FAILURE = 'BITCOIN/HTTP/GET_UTXOS_FAILURE'

// Get top latest block number of a selected bitcoin-like blockchain
export const BITCOIN_HTTP_GET_BLOCKS_HEIGHT = 'BITCOIN/HTTP/GET_BLOCKS_HEIGHT'
export const BITCOIN_HTTP_GET_BLOCKS_HEIGHT_SUCCESS = 'BITCOIN/HTTP/GET_BLOCKS_HEIGHT_SUCCESS'
export const BITCOIN_HTTP_GET_BLOCKS_HEIGHT_FAILURE = 'BITCOIN/HTTP/GET_BLOCKS_HEIGHT_FAILURE'

// Get info about transaction for a selected bitcoin-like blockchain
export const BITCOIN_HTTP_GET_TX_INFO = 'BITCOIN/HTTP/GET_TX_INFO'
export const BITCOIN_HTTP_GET_TX_INFO_SUCCESS = 'BITCOIN/HTTP/GET_TX_INFO_SUCCESS'
export const BITCOIN_HTTP_GET_TX_INFO_FAILURE = 'BITCOIN/HTTP/GET_TX_INFO_FAILURE'

// Get transactions history (list) for a selected bitcoin-like blockchain
export const BITCOIN_HTTP_GET_TX_LIST = 'BITCOIN/HTTP/GET_TX_LIST'
export const BITCOIN_HTTP_GET_TX_LIST_SUCCESS = 'BITCOIN/HTTP/GET_TX_LIST_SUCCESS'
export const BITCOIN_HTTP_GET_TX_LIST_FAILURE = 'BITCOIN/HTTP/GET_TX_LIST_FAILURE'

// Get address info for a selected bitcoin-like blockchain
export const BITCOIN_HTTP_GET_ADDRESS_INFO = 'BITCOIN/HTTP/GET_ADDRESS_INFO'
export const BITCOIN_HTTP_GET_ADDRESS_INFO_SUCCESS = 'BITCOIN/HTTP/GET_ADDRESS_INFO_SUCCESS'
export const BITCOIN_HTTP_GET_ADDRESS_INFO_FAILURE = 'BITCOIN/HTTP/GET_ADDRESS_INFO_FAILURE'

// Send preliminary prepared (signed) transaction for a selected bitcoin-like blockchain
export const BITCOIN_HTTP_POST_SEND_TX = 'BITCOIN/HTTP/POST_SEND_TX'
export const BITCOIN_HTTP_POST_SEND_TX_SUCCESS = 'BITCOIN/HTTP/POST_SEND_TX_SUCCESS'
export const BITCOIN_HTTP_POST_SEND_TX_FAILURE = 'BITCOIN/HTTP/POST_SEND_TX_FAILURE'

// Overall Tx execute
export const BITCOIN_EXECUTE_TX = 'BITCOIN/EXECUTE/TX'
export const BITCOIN_EXECUTE_TX_SUCCESS = 'BITCOIN/EXECUTE/TX_SUCCESS'
export const BITCOIN_EXECUTE_TX_FAILURE = 'BITCOIN/EXECUTE/TX_FAILURE'

// Operation 'sign bitcoin'
export const BITCOIN_SIGN_TX = 'BITCOIN/SIGN/TX'
export const BITCOIN_SIGN_TX_SUCCESS = 'BITCOIN/SIGN/TX_SUCCESS'
export const BITCOIN_SIGN_TX_FAILURE = 'BITCOIN/SIGN/TX_FAILURE'
