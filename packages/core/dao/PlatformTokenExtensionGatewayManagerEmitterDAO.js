/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'

import {
  TX_ASSET_CREATED,
} from './constants/AssetsManagerDAO'

export default class PlatformTokenExtensionGatewayManagerEmitterDAO extends AbstractContractDAO {

  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
      .on('error', this.handleEventsError)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  watchAssetCreate (callback, account) {
    this.on(TX_ASSET_CREATED, callback, { by: account })
  }
}
