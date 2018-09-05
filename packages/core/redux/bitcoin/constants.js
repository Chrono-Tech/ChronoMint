/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BitcoinCashMemoryDevice from '../../services/signers/BitcoinCashMemoryDevice'
import BitcoinTrezorDevice from '../../services/signers/BitcoinTrezorDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorMockDevice'
import BitcoinLedgerDevice from '../../services/signers/BitcoinLedgerDevice'
import BitcoinLedgerDeviceMock from '../../services/signers/BitcoinLedgerDeviceMock'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'

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
