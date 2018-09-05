/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EventEmitter from 'events'
import type { BitcoinEngine } from './BitcoinEngine'
import type { NemEngine } from './NemEngine'
import type { WavesEngine } from './WavesEngine'

export default class AbstractProvider extends EventEmitter {
  constructor (selectNode) {
    super()
    this._engine = null
    this._selectNode = selectNode
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
  }

  id () {
    return this._id
  }

  isInitialized () {
    // Initialized by design if and only if it has an associated engine
    return !!this._engine

  }

  setEngine (engine: NemEngine | BitcoinEngine | WavesEngine) {
    if (this._engine != null) {
      this.unsubscribe(this._engine)
      this._engine = null
    }
    this._engine = engine
    this.subscribe(this._engine)
  }

  subscribe (engine: NemEngine | BitcoinEngine | WavesEngine) {
    const node = this._selectNode(engine)
    node.emit('subscribe', engine.getAddress())
    return node
  }

  unsubscribe (engine: NemEngine | BitcoinEngine | WavesEngine) {
    const node = this._selectNode(engine)
    node.emit('unsubscribe', engine.getAddress())
    return node
  }

  getAddress () {
    return this._engine && this._engine.getAddress() || null
  }

  isAddressValid (address) {
    return this._engine && this._engine.isAddressValid(address)
  }
}
