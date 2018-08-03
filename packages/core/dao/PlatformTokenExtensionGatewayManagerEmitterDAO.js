/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContract3DAO'

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
      .on('data', this.handleEventsData.bind(this))
      .on('changed', this.handleEventsChanged.bind(this))
      .on('error', this.handleEventsError.bind(this))
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  handleEventsData (data) {
    if (!data.event) {
      return
    }
    console.log('PlatformTokenExtensionGatewayManagerEmitterDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  handleEventsChanged (data) {
    console.log('PlatformTokenExtensionGatewayManagerEmitterDAO handleEventsChanged: ', data.event, data)
  }

  handleEventsError (data) {
    console.log('PlatformTokenExtensionGatewayManagerEmitterDAO handleEventsError: ', data.event, data)
    this.emit(data.event + '_error', data)
  }

  watchAssetCreate (callback, account) {
    this.on(TX_ASSET_CREATED, callback, { by: account })
  }
}
