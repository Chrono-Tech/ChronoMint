/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from '../refactor/daos/lib/AbstractContractDAO'

export const TX_CREATE_PLATFORM = 'createPlatform'
export const TX_ATTACH_PLATFORM = 'attachPlatform'
export const TX_DETACH_PLATFORM = 'detachPlatform'
export const TX_REISSUE_ASSET = 'reissueAsset'
export const TX_PLATFORM_REQUESTED = 'PlatformRequested'
export const TX_PLATFORM_ATTACHED = 'PlatformAttached'
export const TX_PLATFORM_DETACHED = 'PlatformDetached'

export default class PlatformsManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
      .on('changed', this.handleEventsChanged)
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

  handleEventsData = (data) => {
    console.log('PlatformsManagerDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  handleEventsChanged = (data) => {
    console.log('PlatformsManagerDAO handleEventsChanged: ', data.event, data)
  }

  handleEventsError = (data) => {
    console.log('PlatformsManagerDAO handleEventsError: ', data.event, data)
    this.emit(data.event + '_error', data)
  }

  async reissueAsset (symbol, amount) {
    this._tx(TX_REISSUE_ASSET, [ symbol, amount ])
  }

  async createPlatform () {
    this._tx(TX_CREATE_PLATFORM)
  }

  async attachPlatform (address) {
    let tx
    try {
      tx = await this._multisigTx(TX_ATTACH_PLATFORM, [ address ])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  async detachPlatform (address) {
    let tx
    try {
      tx = await this._tx(TX_DETACH_PLATFORM, [ address ])
    } catch (e) {
      // eslint-disable-next-line
      console.error(e.message)
    }
    return tx.tx
  }

  watchCreatePlatform (callback, account) {
    this._watch(TX_PLATFORM_REQUESTED, (tx) => callback(tx), { by: account })
    this._watch(TX_PLATFORM_ATTACHED, (tx) => callback(tx), { by: account })
    this._watch(TX_PLATFORM_DETACHED, (tx) => callback(tx), { by: account })
  }

  async _decodeArgs (func, args: Object) {
    switch (func) {
      case TX_ATTACH_PLATFORM:
        return {
          platform: args[ '_platform' ],
        }
      default:
        return args
    }
  }
}
