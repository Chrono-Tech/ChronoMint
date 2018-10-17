/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/** @module core/redux/dash/DashMiddlewareService */

import BitcoinMiddlewareService from '../bitcoin-like-blockchain/MiddlewareService'

const URL_SEND = 'tx/send'

/** Class for HTTP requests to nodes in Testnet and Mainnet. */
export default class DashMiddlewareService {
  /**
   * Request sending of  preliminary prepared and signed transaction
   * @return {Promise} Axios GET request for further processing.
   */
  static requestSendTx (tx, blockchain, networkType) {
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)
    if (!currentNode) {
      return Promise.reject(BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `POST: ${URL_SEND}`))
    }

    return currentNode.post(URL_SEND, {
      rawtx: tx.toString(),
    })
  }
}
