/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/** @module core/redux/bitcoin/BitcoinMiddlewareService */

import BitcoinLikeBlockchainMiddlewareService from '../abstractBitcoin/MiddlewareService'

const URL_BLOCKS_HEIGHT = 'blocks/height'
const URL_TX = 'tx'
const URL_HISTORY = (address, skip, offset) => `tx/${address}/history?skip=${skip}&limit=${offset}`
const URL_ADDRESS_INFO = (address) => `addr/${address}/balance`
const URL_SEND = 'tx/send'

/** Class for HTTP requests to nodes in Testnet and Mainnet. */
export default class BitcoinMiddlewareService extends BitcoinLikeBlockchainMiddlewareService {

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

    return currentNode.request({
      method: 'GET',
      url: URL_ADDRESS_INFO(address),
    })
  }

  static async fallbackBalance (address, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      const error = BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `GET: ${URL_ADDRESS_INFO(address)}`)
      return Promise.reject(error)
    }

    const [confirmedBalance, unconfirmedBalance] = await Promise.all(
      [
        BitcoinMiddlewareService.requestBlockdozerConfirmedBalance(currentNode, address),
        BitcoinMiddlewareService.requestBlockdozerUnconfirmedBalance(currentNode, address),
      ].map((promise) => promise.catch((error) => {
        return error
      })) // We will handle errors by ourselves
    )

    if (confirmedBalance instanceof Error || unconfirmedBalance instanceof Error) {
      return Promise.reject({ confirmedBalance, unconfirmedBalance, config: { host: 'https://test-bcc.chronobank.io' } })
    } else {
      return Promise.resolve({ confirmedBalance, unconfirmedBalance, config: { host: 'https://test-bcc.chronobank.io' } })
    }
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
