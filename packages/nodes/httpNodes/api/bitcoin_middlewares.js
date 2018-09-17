/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_BITCOIN_CASH } from '@chronobank/core/dao/constants'
import { requestBitcoinCashAddressInfo } from './explorers/blockdozer'

export const requestBitcoinCurrentBlockHeight = (blockchain) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/BLOCKHEIGHT',
    blockchain,
    payload: {
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

export const requestBitcoinTransactionInfo = (blockchain, txid) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/TRANSACTIONINFO',
    blockchain,
    payload: {
      request: {
        method: 'GET',
        url: `/tx/${txid}`,
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

export const requestBitcoinTransactionList = (blockchain, address, id, skip, offset) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/TRANSACTIONINFO',
    blockchain,
    payload: {
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

export const requestBitcoinAddressInfo = (blockchain, address) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/ADDRESSINFO',
    blockchain,
    payload: {
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
      if (blockchain === BLOCKCHAIN_BITCOIN_CASH) {
        return dispatch(requestBitcoinCashAddressInfo(address))
      } else {
        throw new Error(error)
      }
    })
}

export const requestBitcoinAddressUTXOS = (blockchain, address) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/ADDRESSUTXOS',
    blockchain,
    payload: {
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

export const requestBitcoinSendTx = (blockchain, params) => (dispatch) => {
  const action = {
    type: 'REQ/GET/BITCOIN/SENDTX',
    blockchain,
    payload: {
      request: {
        method: 'POST',
        url: '/tx/send',
        data: params,
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
