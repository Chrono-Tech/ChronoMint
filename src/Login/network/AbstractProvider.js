import EventEmitter from 'events'
import type { BitcoinEngine } from './BitcoinEngine'
import type NemEngine from './NemEngine'

export default class AbstractProvider extends EventEmitter {
  constructor (selectNode) {
    super()
    this._engine = null
    this._selectNode = selectNode
    this._isInited = false
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
  }

  isInitialized () {
    return this._isInited
  }

  setEngine (engine: NemEngine | BitcoinEngine) {
    if (this._isInited) {
      this.unsubscribe(this._engine)
    }
    this._engine = engine
    this.subscribe(this._engine)
    this._isInited = true
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
