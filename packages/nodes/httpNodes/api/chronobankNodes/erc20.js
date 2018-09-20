/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * See middleware API documantaion here:
 * https://github.com/ChronoBank/middleware-eth-rest
 * https://github.com/ChronoBank/middleware-eth-2fa
 */

import { BLOCKCHAIN_ETHEREUM } from '@chronobank/core/dao/constants'

/**
 * await this._api.post('addr', {
	address: ethAddress,
	nem: nemAddress,
	waves: wavesAddress,
})
await this._api.delete('addr', {
	address: ethAddress,
	//nem: nemAddress,
	//waves: wavesAddress,
})
_api.get(`tx/${address}/history?skip=${skip}&limit=${offset}`)
_api.get(`events/${eventName}/?${queryFilter}`)
_api.get(`addr/${address}/balance`)
 */

/**
 * register new address on middleware
 * @param {string} address
 */
export const requestErc20SubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/POST/SUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
      request: {
        method: 'POST',
        url: '/addr',
        data: {
          address,
        },
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
export const requestErc20UnubscribeWalletByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/DELETE/UNSUBSCRIBE',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
      request: {
        method: 'DELETE',
        url: '/addr',
        data: {
          address,
        },
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
export const requestErc20BalanceByAddress = (address) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/GET/BALANCE',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
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
export const requestErc20SendRawTransaction = (rawTx) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/POST/SEND_RAW_TRANSACTION',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
      request: {
        method: 'POST',
        url: '/tx/send',
        data: {
          tx: rawTx,
        },
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
export const requestErc20TransactionsHistoryByAddress = (address, skip = 0, offset = TXS_PER_PAGE) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/GET/TRANSACTIONS_HISTORY',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
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
export const requestErc20TransactionByHash = (txHash) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/GET/TRANSACTION_BY_HASH',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
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
 * retrieve transaction by its hash
 * @param {string} txHash
 */
export const requestErc20ListEvents = () => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/GET/EVENTS',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
      request: {
        method: 'GET',
        url: '/events',
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
export const requestErc20ListEventsByName = (eventName) => (dispatch) => {
  const action = {
    type: 'REQ/MIDDLEWARE/ERC20/GET/EVENTS_BY_NAME',
    payload: {
      blockchain: BLOCKCHAIN_ETHEREUM,
      request: {
        method: 'GET',
        url: `/events/${eventName}`,
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
