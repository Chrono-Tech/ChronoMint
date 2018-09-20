/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * See middleware API documantaion here: https://github.com/ChronoBank/middleware-nem-rest
 */

import { BLOCKCHAIN_NEM } from '@chronobank/core/dao/constants'

/**
 * register new address on middleware
 * @param {string} address
 */
export const requestNemSubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/POST/SUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
export const requestNemUnubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/DELETE/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
export const requestNemBalanceByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/GET/BALANCE',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
 * broadcast new transaction to network
 * @param {string} rawTx
 */
export const requestNemSendRawTransaction = (rawTx) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/POST/SEND_RAW_TRANSACTION',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
export const requestNemTransactionsHistoryByAddress = (address, skip = 0, offset = TXS_PER_PAGE) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/GET/TRANSACTIONS_HISTORY',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
export const requestNemTransactionByHash = (txHash) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/NEM/GET/TRANSACTION_BY_HASH',
    payload: {
      blockchain: BLOCKCHAIN_NEM,
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
