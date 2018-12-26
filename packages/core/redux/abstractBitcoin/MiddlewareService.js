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
const BCC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-bcc-mainnet-rest.chronobank.io', timeout: 10000 })
const BCC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-bcc-testnet-rest.chronobank.io', timeout: 10000, withCredentials: false })
const DASH_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-dash-mainnet-stage.chronobank.io', timeout: 10000 })
const DASH_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-dash-dev.chronobank.io', timeout: 10000 })
const LTC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-mainnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })
const LTC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-testnet-rest.chronobank.io', timeout: HTTP_TIMEOUT })

const URL_GET_UTXOS = (address) => `addr/${address}/utxo`

/** Class for HTTP requests to nodes in Testnet and Mainnet. */
export default class BitcoinMiddlewareService {
  static service = {
    [BLOCKCHAIN_BITCOIN]: {
      bitcoin: BTC_MAINNET_NODE,
      testnet: BTC_TESTNET_NODE,
    },
    [BLOCKCHAIN_BITCOIN_CASH]: {
      bitcoin: BCC_MAINNET_NODE,
      testnet: BCC_TESTNET_NODE,
    },
    [BLOCKCHAIN_LITECOIN]: {
      litecoin: LTC_MAINNET_NODE,
      litecoin_testnet: LTC_TESTNET_NODE,
    },
    [BLOCKCHAIN_DASH]: {
      bitcoin: DASH_MAINNET_NODE,
      testnet: DASH_TESTNET_NODE,
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
}
