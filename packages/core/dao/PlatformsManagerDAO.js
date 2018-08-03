/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContract3DAO'
import TokenManagementExtensionManager from './TokenManagementExtensionManager'

//#region CONSTANTS

import {
  TX_ATTACH_PLATFORM,
  TX_CREATE_PLATFORM,
  TX_DETACH_PLATFORM,
  TX_PLATFORM_ATTACHED,
  TX_PLATFORM_DETACHED,
  TX_PLATFORM_REQUESTED,
  TX_REISSUE_ASSET,
} from './constants/PlatformsManagerDAO'

//#endregion CONSTANTS

export default class PlatformsManagerDAO extends AbstractContractDAO {
  constructor ({ address, history, abi }) {
    super({ address, history, abi })

    this.tokenManagementExtensionManager = null
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
    if (!data.event) {
      return
    }
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

  /**
   *
   * @param state
   * @param web3
   * @param history
   * @param subscribeTxFlow
   */
  postStoreDispatchSetup (state, web3, history, subscribeTxFlow) {
    console.log('postStoreDispatchSetup: TokenManagementExtensionManager: ', history)
    const tokenManagementExtensionManager = new TokenManagementExtensionManager({ web3, history, subscribeTxFlow })
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
   * @returns {Promise<void>}
   */
  async reissueAsset (symbol, amount) {
    this._tx(TX_REISSUE_ASSET, [ symbol, amount ])
  }

  /**
   *
   * @returns {Promise<void>}
   */
  async createPlatform () {
    this._tx(TX_CREATE_PLATFORM)
  }

  /**
   *
   * @param address
   * @returns {Promise<void>}
   */
  async attachPlatform (address) {
    await this._multisigTx(TX_ATTACH_PLATFORM, [ address ])
  }

  /**
   *
   * @param address
   * @returns {Promise<void>}
   */
  async detachPlatform (address) {
    this._tx(TX_DETACH_PLATFORM, [ address ])
  }

  /**
   *
   * @param callback
   * @param account
   */
  watchCreatePlatform (callback, account) {
    this.on(TX_PLATFORM_REQUESTED, (tx) => callback(tx), { by: account })
    this.on(TX_PLATFORM_ATTACHED, (tx) => callback(tx), { by: account })
    this.on(TX_PLATFORM_DETACHED, (tx) => callback(tx), { by: account })
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
