/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/**
 * This module use the same API as all other middleware's HTTP API
 * Must be reused for all other Bitcoin-like blockchains
 * @module HTTP/middleware-bitcoin
 */

import axios from 'axios'

const baseURL = 'https://middleware-bitcoin-mainnet-rest.chronobank.io'
const timeout = 4000 // 4 seconds

const service = axios.create({
  baseURL,
  timeout,
})

// const URL_BLOCKS_HEIGHT = 'blocks/height'
const URL_TX = (txid) => `tx/${txid}`
const URL_HISTORY = (address, skip, offset) => `tx/${address}/history?skip=${skip}&limit=${offset}`
// const URL_ADDRESS_INFO = (address) => `addr/${address}/balance`
// const URL_GET_UTXOS = (address) => `addr/${address}/utxo`
// const URL_SEND = 'tx/send'

/**
 * Request info about transaction by its ID (hash)
 * @return {Promise} Axios GET request for further processing.
 */
export const requestBitcoinTransactionInfo = (txid) =>
  service.request({
    method: 'GET',
    url: URL_TX(txid),
  })

/**
 * Request list of a transactions for specified address
 * @return {Promise} Axios GET request for further processing.
 */
export const requestBitcoinTransactionsList = (address, id, skip, offset) =>
  service.request({
    method: 'GET',
    url: URL_HISTORY(address, skip, offset),
  })
