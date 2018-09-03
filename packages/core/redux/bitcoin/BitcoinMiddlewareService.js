/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import axios from 'axios'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_LITECOIN } from '../../dao/constants'

const BTC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-bitcoin-mainnet-rest.chronobank.io', timeout: 4000 })
const BTC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-bitcoin-testnet-rest.chronobank.io', timeout: 4000 })
export const LTC_MAINNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-mainnet-rest.chronobank.io', timeout: 4000 })
export const LTC_TESTNET_NODE = axios.create({ baseURL: 'https://middleware-litecoin-testnet-rest.chronobank.io', timeout: 4000 })

const URL_BLOCKS_HEIGHT = 'blocks/height'
const URL_TX = 'tx'
const URL_HISTORY = (address, skip, offset) => `tx/${address}/history?skip=${skip}&limit=${offset}`
const URL_ADDRESS_INFO = (address) => `addr/${address}/balance`
const URL_GET_UTXOS = (address) => `addr/${address}/utxo`
const URL_SEND = 'tx/send'

export default class BitcoinMiddlewareService {
  static service = {
    [BLOCKCHAIN_BITCOIN]: {
      bitcoin: BTC_MAINNET_NODE,
      testnet: BTC_TESTNET_NODE,
    },
    [BLOCKCHAIN_LITECOIN]: {
      litecoin: LTC_MAINNET_NODE,
      litecoin_testnet: LTC_TESTNET_NODE,
    },
  }

  static getCurrentBlockHeight ({ blockchain, type }) {
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'GET',
      url: URL_BLOCKS_HEIGHT,
    })
  }

  static getTransactionInfo (txid, { blockchain, type }) {
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'GET',
      url: `${URL_TX}/${txid}`,
    })
  }

  static getTransactionsList (address, id, skip, offset, { blockchain, type }) {
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'GET',
      url: URL_HISTORY(address, skip, offset),
    })
  }

  static getAddressInfo (address, { blockchain, type }) {
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'GET',
      url: URL_ADDRESS_INFO(address),
    })
  }

  static getAddressUTXOS (address, { blockchain, type }) {
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'GET',
      url: URL_GET_UTXOS(address),
    })
  }

  static send (rawtx, { blockchain, type }) {
    const params = new URLSearchParams()
    params.append('tx', rawtx)
    return BitcoinMiddlewareService.service[blockchain][type].request({
      method: 'POST',
      url: URL_SEND,
      data: params,
    })
  }
}
