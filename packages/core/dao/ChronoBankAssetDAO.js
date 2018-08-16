/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AbstractContractDAO from './AbstractContractDAO'
import { ChronoBankAssetABI } from './abi'

import {
  TX_PAUSE,
  TX_RESTRICT,
  TX_UNPAUSE,
  TX_UNRESTRICT,
} from './constants/ChronoBankAssetDAO'

export default class ChronoBankAssetDAO extends AbstractContractDAO {

  constructor (address, history) {
    super({ address, history, abi: ChronoBankAssetABI })
  }

  connect (web3, options) {
    super.connect(web3, options)

    this.allEventsEmitter = this.history.events.allEvents({})
      .on('data', this.handleEventsData.bind(this))
  }

  disconnect () {
    if (this.isConnected) {
      this.allEventsEmitter.removeAllListeners()
      this.contract = null
      this.history = null
      this.web3 = null
    }
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
    return this._tx(TX_RESTRICT, [address])
  }

  unrestrict (address: Array<string>): boolean {
    return this._tx(TX_UNRESTRICT, [address])
  }

  blacklist (address): boolean {
    return this.contract.methods.blacklist(address).call()
  }
}
