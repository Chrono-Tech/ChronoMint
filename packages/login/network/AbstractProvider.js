import EventEmitter from 'events'
import type { BitcoinEngine } from './BitcoinEngine'
import type NemEngine from './NemEngine'

export default class AbstractProvider extends EventEmitter {
  constructor (selectNode) {
    super()
    this._engine = null
    this._selectNode = selectNode
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
  }

  isInitialized () {
    // Initialized by design if and only if it has an associated engine
    return !!this._engine

  }
  setEngine (engine: NemEngine | BitcoinEngine) {
    if (this._engine) {
      this.unsubscribe(this._engine)
    }
    this._engine = engine
    if (this._engine) {
      this.subscribe(this._engine)
    }
  }

  subscribe (engine: NemEngine | BitcoinEngine) {
    const node = this._selectNode(engine)
    node.emit('subscribe', engine.getAddress())
    return node
  }

  unsubscribe (engine: NemEngine | BitcoinEngine) {
    const node = this._selectNode(engine)
    node.emit('unsubscribe', engine.getAddress())
    return node
  }

  getAddress () {
    return this._engine && this._engine.getAddress() || null
  }
}
