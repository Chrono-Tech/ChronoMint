/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContract3DAO'

//#region CONSTANTS

import {
  CALL_BLACKLIST,
  CALL_PAUSED,
  TX_PAUSE,
  // TX_PAUSED,
  TX_RESTRICT,
  // TX_RESTRICTED,
  TX_UNPAUSE,
  // TX_UNPAUSED,
  TX_UNRESTRICT,
  // TX_UNRESTRICTED,
} from './constants/ChronoBankAssetDAO'

//#endregion CONSTANTS

export default class ChronoBankAssetDAO extends AbstractContractDAO {

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
    console.log('ChronoBankAssetDAO handleEventsData: ', data.event, data)
    this.emit(data.event, data)
  }

  handleEventsChanged (data) {
    console.log('ChronoBankAssetDAO handleEventsChanged: ', data.event, data)
  }

  handleEventsError (data) {
    console.log('ChronoBankAssetDAO handleEventsError: ', data.event, data)
    this.emit(data.event + '_error', data)
  }

  getPauseStatus () {
    return this.contract.methods.paused().call()
  }

  pause () {
    return this._tx(TX_PAUSE)
  }

  unpause () {
    return this._tx(TX_UNPAUSE)
  }

  restrict (address: Array<string>): boolean {
    return this._tx(TX_RESTRICT, [ address ])
  }

  unrestrict (address: Array<string>): boolean {
    return this._tx(TX_UNRESTRICT, [ address ])
  }

  blacklist (address): boolean {
    return this.contract.methods.blacklist(address).call()
  }
}
