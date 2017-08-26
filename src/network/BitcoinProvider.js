import type BitcoinEngine from './BitcoinEngine'
import type BitcoinNode from './BitcoinNode'

export class BitcoinProvider {

  constructor () {
    this._node = null
    this._engine = null
  }

  setEngine (engine: BitcoinEngine) {
    this._engine = engine
  }

  getEngine () {
    return this._engine
  }

  setNode (node: BitcoinNode) {
    this._node = node
  }

  getNode () {
    return this._node
  }
}

export default new BitcoinProvider()
