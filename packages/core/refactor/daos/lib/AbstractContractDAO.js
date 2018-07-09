/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import web3Converter from '../../../utils/Web3Converter'

export default class AbstractContractDAO extends EventEmitter {
  /**
   * @type Web3Converter
   * @protected
   */
  _c = web3Converter

  constructor ({ address, history, abi }) {
    super()
    this.address = address
    this.history = history
    this.abi = abi
  }

  connect (web3, options) {
    if (this.isConnected) {
      this.disconnect()
    }
    // eslint-disable-next-line no-console
    console.log(`[${this.constructor.name}] Connect`)
    this.contract = new web3.eth.Contract(this.abi.abi, this.address, options)
    this.history = this.history != null // nil check
      ? new web3.eth.Contract(this.abi.abi, this.history, options)
      : this.contract
  }

  get isConnected () {
    return this.contract != null
  }

  disconnect () {
    if (this.isConnected) {
      this.contract = null
      this.history = null
    }
  }
}
