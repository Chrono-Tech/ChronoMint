import BitcoinNode from './BitcoinNode'
import type BitcoinEngine from './BitcoinEngine'
import type BigNumber from 'BigNumber.js'

export class BitcoinProvider {

  constructor (node) {
    this._node = node
  }

  subscribe (engine) {
    this._node.emit('subscribe', engine.getAddress())
    this._node.addListener('tx', engine.handleTransaction)
  }

  unsubscribe (engine) {
    this._node.emit('unsubscribe', engine.getAddress())
    this._node.removeListener('tx', engine.handleTransaction)
  }

  setEngine (engine: BitcoinEngine) {
    this._node && this._engine && this.unsubscribe(this._engine)
    this._engine = engine
    this._node && this.subscribe(this._engine)
  }

  getAddress () {
    return this._engine.getAddress()
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await this._node.getAddressInfo(this._engine.getAddress())
    return { balance0, balance6 }
  }

  async transfer (to, amount: BigNumber) {
    console.log('BitcoinProvider, transfer', to, amount.toString())
    try {
      const utxos = await this._node.getAddressUTXOS(this._engine.getAddress())
      console.log(utxos)
      const { tx, fee } = this._engine.createTransaction(to, amount, utxos)
      console.log(tx, fee)
      console.log(tx.toHex())
      return await this._node.send(tx.toHex())
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

export default new BitcoinProvider(new BitcoinNode())
