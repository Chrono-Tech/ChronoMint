/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/** @module core/redux/bitcoin/BitcoinMiddlewareService */

import axios from 'axios'
import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
} from '../../dao/constants'

const HTTP_TIMEOUT = 4000

const BTC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-bitcoin-mainnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })
const BTC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })
const BCC_MAINNET_NODE = axios.create({ baseURL: 'https://explorer.bitcoingold.org/insight-api', timeout: 10000 })
const BCC_TESTNET_NODE = axios.create({ baseURL: 'https://tbcc.blockdozer.com/insight-api', timeout: 10000, withCredentials: false })
const DASH_MAINNET_NODE = axios.create({ baseURL: 'https://insight.dash.siampm.com/api', timeout: 10000 })
const DASH_TESTNET_NODE = axios.create({ baseURL: 'https://testnet-insight.dashevo.org/insight-api-dash', timeout: 10000 })
const LTC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-mainnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })
const LTC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-testnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })

const URL_BLOCKS_HEIGHT = 'blocks/height'
const URL_TX = 'tx'
const URL_HISTORY = (address, skip, offset) => `tx/${address}/history?skip=${skip}&limit=${offset}`
const URL_ADDRESS_INFO = (address) => `addr/${address}/balance`
const URL_GET_UTXOS = (address) => `addr/${address}/utxo`
const URL_SEND = 'tx/send'

/** Class for HTTP requests to nodes in Testnet and Mainnet. */
export default class BitcoinMiddlewareService {
  static service = {
    [BLOCKCHAIN_BITCOIN_CASH]: {
      bitcoin: BCC_MAINNET_NODE,
      testnet: BCC_TESTNET_NODE,
    },
    [BLOCKCHAIN_BITCOIN]: {
      bitcoin: BTC_MAINNET_NODE,
      testnet: BTC_TESTNET_NODE,
    },
    [BLOCKCHAIN_DASH]: {
      bitcoin: DASH_MAINNET_NODE,
      testnet: DASH_TESTNET_NODE,
    },
    [BLOCKCHAIN_LITECOIN]: {
      litecoin: LTC_MAINNET_NODE,
      litecoin_testnet: LTC_TESTNET_NODE,
    },
  }

  /**
   * Generate Error with appropriate message
   * @private
   * @return {Error} Error with details
   */
  static genErrorMessage (blockchain, type, requestName) {
    return new Error(`Can't perform HTTP(s) request '${requestName}'. Node for ${blockchain}/${type} not found in config.`)
  }

  /**
   * Select current node to send HTTPS request (based on data from Redux store)
   * @private
   * @return {Object} result of 'axios.create'
   */
  static getCurrentNode (blockchain, networkType) {
    return BitcoinMiddlewareService.service[blockchain] && BitcoinMiddlewareService.service[blockchain][networkType] || null
  }

  static requestBitcoinCurrentBlockHeight (blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_BLOCKS_HEIGHT}`)
      return Promise.reject(error)
    }

    return currentNode.request({
      method: 'GET',
      url: URL_BLOCKS_HEIGHT,
    })
  }

  /**
   * Request info about transaction by its ID (hash)
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBitcoinTransactionInfo (txid, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_TX}/${txid}`)
      return Promise.reject(error)
    }

    return currentNode.request({
      method: 'GET',
      url: `${URL_TX}/${txid}`,
    })
  }

  /**
   * Request list of a transactions for specified address
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBitcoinTransactionsList (address, id, skip, offset, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_HISTORY(address, skip, offset)}`)
      return Promise.reject(error)
    }

    return currentNode.request({
      method: 'GET',
      url: URL_HISTORY(address, skip, offset),
    })
  }

  /**
   * Request blockdozer.com for confirmed balance by address
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBlockdozerConfirmedBalance (currentNode, address) {
    return currentNode.request({
      method: 'GET',
      url: URL_ADDRESS_INFO(address),
    })
  }

  /**
   * Request blockdozer.com for unconfirmed balance by address
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBlockdozerUnconfirmedBalance (currentNode, address) {
    return currentNode.request({
      method: 'GET',
      url: `addr/${address}/unconfirmedBalance`,
    })
  }

  /**
   * Request info about specified address
   * @return {Promise} Axios GET request for further processing.
   */
  static async requestBitcoinAddressInfo (address, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_ADDRESS_INFO(address)}`)
      return Promise.reject(error)
    }

    // In the testnet we are using blockdozer to get BCC balances
    if (blockchain === BLOCKCHAIN_BITCOIN_CASH && networkType === 'testnet') {
      const [confirmedBalance, unconfirmedBalance] = await Promise.all(
        [
          BitcoinMiddlewareService.requestBlockdozerConfirmedBalance(currentNode, address),
          BitcoinMiddlewareService.requestBlockdozerUnconfirmedBalance(currentNode, address),
        ].map((promise) => promise.catch((error) => error)) // We will handle errors by ourselves
      )

      if (confirmedBalance instanceof Error || unconfirmedBalance instanceof Error) {
        return Promise.reject({ confirmedBalance, unconfirmedBalance, config: { host: 'https://tbcc.blockdozer.com/insight-api' } })
      } else {
        return Promise.resolve({ confirmedBalance, unconfirmedBalance, config: { host: 'https://tbcc.blockdozer.com/insight-api' } })
      }
    }

    return currentNode.request({
      method: 'GET',
      url: URL_ADDRESS_INFO(address),
    })
  }

  /**
   * Request UTXOS for specified address
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBitcoinAddressUTXOS (address, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_GET_UTXOS(address)}`)
      return Promise.reject(error)
    }

    return currentNode.request({
      method: 'GET',
      url: URL_GET_UTXOS(address),
    })
  }

  /**
   * Request sending of  preliminary prepared and signed transaction
   * @return {Promise} Axios GET request for further processing.
   */
  static requestBitcoinSendTx (rawtx, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `POST: ${URL_SEND}`)
      return Promise.reject(error)
    }
    const params = new URLSearchParams()
    params.append('tx', rawtx)

    return currentNode.request({
      method: 'POST',
      url: URL_SEND,
      data: params,
    })
  }
}
