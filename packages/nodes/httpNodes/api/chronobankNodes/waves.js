/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * See middleware API documantaion here: https://github.com/ChronoBank/middleware-waves-rest
 */

import { BLOCKCHAIN_WAVES } from '@chronobank/core/dao/constants'

const TXS_PER_PAGE = 20
/**
 * get transactions for the registered address (by default skip = 0, limit=100)
 * @param {string} address
 * @param {number} skip [optional]
 * @param {number} offset [optional]
 */
export const requestWavesTransactionsHistory = (address, skip = 0, offset = TXS_PER_PAGE) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/GET/TRANSACTIONS_HISTORY',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
      request: {
        method: 'GET',
        url: `/tx/${address}/history?skip=${skip}&limit=${offset}`,
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
 * get balance of the registered address
 * @param {string} address
 */
export const requestWavesBalanceByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/GET/BALANCE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
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
 * retrieve transaction by its hash
 * @param {string} txHash
 */
export const requestWavesTransactionByHash = (txHash) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/GET/TRANSACTION_BY_HASH',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
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
 * register new address on middleware
 * @param {string} address
 */
export const requestWavesSubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/POST/SUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
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
export const requestWavesUnubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/DELETE/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
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
 * push passed assets to an existing one for the registered user
 * @param {string} address
 * @param {string[]} assets
 */
export const requestWavesPushAssets = (address, assets) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/POST/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
      request: {
        method: 'POST',
        url: `/addr/${address}/token`,
        data: assets,
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
 * delete passed assets from the registered user
 * @param {string} address
 * @param {string[]} assets
 */
export const requestWavesDeleteAssets = (address, assets) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/DELETE/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
      request: {
        method: 'DELETE',
        url: `/addr/${address}/token`,
        data: assets,
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
 * send signed tx
 * @param {string} rawTx
 */
export const requestWavesSendRawTransaction = (rawTx) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/WAVES/POST/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_WAVES,
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
