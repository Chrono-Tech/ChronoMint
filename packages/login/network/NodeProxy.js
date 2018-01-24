import { NemEngine } from './NemEngine'
import { BitcoinEngine } from './BitcoinEngine'

export default class NodeProxy {
  constructor (firstNode, secondNode) {
    this._firstNode = firstNode
    this._secondNode = secondNode
  }

  _do (func, ...params) {
    try {
      return this._firstNode[ func ](...params)
    } catch (e) {
      // eslint-disable-next-line
      console.warn(`${func}, firstNode`, e.message)
      return this._secondNode[ func ](...params)
    }
  }

  subscribe (engine: NemEngine | BitcoinEngine) {
    this._firstNode.emit('subscribe', engine.getAddress())
    return this._firstNode
  }

  unsubscribe (engine: NemEngine | BitcoinEngine) {
    this._firstNode.emit('unsubscribe', engine.getAddress())
    return this._firstNode
  }

  getAddressInfo (address) {
    return this._do('getAddressInfo', [ address ])
  }

  getFeeRate () {
    return this._do('getFeeRate')
  }

  getTransactionsList (address) {
    return this._do('getTransactionsList', address)
  }

  getTransactionInfo (txid) {
    return this._do('getTransactionInfo', txid)
  }
}
