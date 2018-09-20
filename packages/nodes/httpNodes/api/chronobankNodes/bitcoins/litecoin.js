/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * See middleware API documantaion here: https://github.com/ChronoBank/middleware-bitcoin-rest
 */

import { BLOCKCHAIN_LITECOIN } from '@chronobank/core/dao/constants'

/**
 * register new address on middleware
 * @param {string} address
 */
export const requestSubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/POST/SUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'POST',
        url: '/addr',
        data: address,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * remove an address from middleware
 * @param {string} address
 */
export const requestUnubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/DELETE/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'DELETE',
        url: '/addr',
        data: address,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * retrieve balance of the registered address
 * @param {string} address
 */
export const requestBalanceByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/GET/BALANCE',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: `/addr/${address}/balance`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * returns an array of unspent transactions (utxo)
 * @param {string} address
 */
export const requestUtxoByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/GET/UTXO',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: `/addr/${address}/utxo`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * broadcast new transaction to network
 * @param {string} rawTx
 */
export const requestSendRawTransaction = (rawTx) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/POST/SEND_RAW_TRANSACTION',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'POST',
        url: '/tx/send',
        data: rawTx,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

const TXS_PER_PAGE = 20
/**
 * retrieve transactions for the registered adresses [use skip and limit paramters]
 * @param {string} address
 */
export const requestTransactionsHistoryByAddress = (address, skip = 0, offset = TXS_PER_PAGE) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/GET/TRANSACTIONS_HISTORY',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: `tx/${address}/history?skip=${skip}&limit=${offset}`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}
/**
 * retrieve transaction by its hash
 * @param {string} txHash
 */
export const requestTransactionByHash = (txHash) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/GET/TRANSACTION_BY_HASH',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: `/tx/${txHash}`,
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * estimate fee rate (based on last 6 blocks)
 */
export const requestEstimateFeeRate = () => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/LITECOIN/GET/ESTIMATE_FEE_RATE',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: '/estimate/feerate',
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}

/**
 * get current block height
 */
export const requestBlocksHeigh = () => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/BLOCKCHAIN_LITECOIN/GET/BLOCKS_HEIGHT',
    payload: {
      blockchain: BLOCKCHAIN_LITECOIN,
      request: {
        method: 'GET',
        url: '/blocks/height',
      },
    },
  }

  return dispatch(action)
    .then((result) => {
      return result
    })
    .catch((error) => {
      throw new Error(error)
    })
}
