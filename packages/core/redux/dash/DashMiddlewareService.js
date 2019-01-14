/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

/** @module core/redux/dash/DashMiddlewareService */

import BitcoinMiddlewareService from '../abstractBitcoin/MiddlewareService'

const URL_SEND = 'tx/send'
const URL_INSTANT_SEND = 'tx/sendix'

/** Class for HTTP requests to nodes in Testnet and Mainnet. */
export default class DashMiddlewareService {
  /**
   * Request sending of  preliminary prepared and signed transaction
   * @return {Promise} Axios GET request for further processing.
   */
  static requestSendTx (tx, blockchain, networkType, instantSend) {
    const url = instantSend ? URL_INSTANT_SEND : URL_SEND
    const currentNode = BitcoinMiddlewareService.getCurrentNode(blockchain, networkType)

    if (!currentNode) {
      return Promise.reject(BitcoinMiddlewareService.genErrorMessage(blockchain, networkType, `POST: ${url}`))
    }

    return currentNode.post(url, {
      rawtx: tx.toString(),
    })
  }
}
