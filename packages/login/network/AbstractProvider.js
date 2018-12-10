/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'

export default class AbstractProvider extends EventEmitter {
  constructor (selectNode) {
    super()
    this.networkSettings = null
    this._selectNode = selectNode
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
  }

  id () {
    return this._id
  }

  setNetworkSettings (networkSettings) {
    this.networkSettings = networkSettings
  }

  isInitialized () {
    return !!this.networkSettings
  }

  subscribe (address) {
    const node = this._selectNode(this.networkSettings)
    node.emit('subscribe', address)
    return node
  }

  unsubscribe (address) {
    const node = this._selectNode(this.networkSettings)
    node.emit('unsubscribe', address)
    return node
  }
}
