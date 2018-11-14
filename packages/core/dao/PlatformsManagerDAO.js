/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'
import TokenManagementExtensionManager from './TokenManagementExtensionManager'

import {
  TX_ATTACH_PLATFORM,
  TX_CREATE_PLATFORM,
  TX_DETACH_PLATFORM,
  EVENT_PLATFORM_ATTACHED,
  EVENT_PLATFORM_DETACHED,
  EVENT_PLATFORM_REQUESTED,
  TX_REISSUE_ASSET,
} from './constants/PlatformsManagerDAO'

export default class PlatformsManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this.tokenManagementExtensionManager = null
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData)
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
  }

  /**
   * remove me
   * @returns {string}
   */
  getSymbol () {
    return 'ETH'
  }

  /**
   *
   * @param state
   * @param web3
   * @param history
   * @param subscribeTxFlow
   */
  postStoreDispatchSetup (state, web3, history) {
    const tokenManagementExtensionManager = new TokenManagementExtensionManager({ web3, history })
    this.setTokenManagementExtensionManager(tokenManagementExtensionManager)
  }

  /**
   *
   * @param tokenManagementExtensionManager
   */
  setTokenManagementExtensionManager (tokenManagementExtensionManager) {
    this.tokenManagementExtensionManager = tokenManagementExtensionManager
  }

  /**
   *
   * @param symbol
   * @param amount
   * @returns {{from, to, value, data}}
   */
  reissueAsset (symbol, amount) {
    return this._tx(TX_REISSUE_ASSET, [symbol, amount])
  }

  /**
   *
   * @returns {{from, to, value, data}}
   */
  createPlatform () {
    return this._tx(TX_CREATE_PLATFORM)
  }

  /**
   *
   * @param address
   * @returns {{from, to, value, data}}
   */
  attachPlatform (address) {
    return this._tx(TX_ATTACH_PLATFORM, [address])
  }

  /**
   *
   * @param address
   * @returns {{from, to, value, data}}
   */
  detachPlatform (address) {
    return this._tx(TX_DETACH_PLATFORM, [address])
  }

  /**
   *
   * @param callback
   * @param account
   */
  watchCreatePlatform (callback, account) {
    this.on(EVENT_PLATFORM_REQUESTED, (tx) => callback(tx), { by: account })
    this.on(EVENT_PLATFORM_ATTACHED, (tx) => callback(tx), { by: account })
    this.on(EVENT_PLATFORM_DETACHED, (tx) => callback(tx), { by: account })
  }

  async _decodeArgs (func, args: Object) {
    switch (func) {
      case TX_ATTACH_PLATFORM:
        return {
          platform: args['_platform'],
        }
      default:
        return args
    }
  }
}
