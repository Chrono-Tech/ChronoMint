import { MAINNET, TESTNET } from './BitcoinNode'
import type BitcoinEngine from './BitcoinEngine'
import type BigNumber from 'BigNumber.js'
import { networks } from 'bitcoinjs-lib'
import EventEmitter from 'events'

export class BitcoinProvider extends EventEmitter {

  constructor () {
    super()
    this.handleTransaction = (tx) => this.onTransaction(tx)
  }

  subscribe (engine) {
    const node = selectNode(engine)
    node.emit('subscribe', engine.getAddress())
    node.addListener('tx', this.handleTransaction)
  }

  unsubscribe (engine) {
    const node = selectNode(engine)
    node.emit('unsubscribe', engine.getAddress())
    node.removeListener('tx', this.handleTransaction)
  }

  setEngine (engine: BitcoinEngine) {
    this._engine && this.unsubscribe(this._engine)
    this._engine = engine
    this.subscribe(this._engine)
  }

  getAddress () {
    return this._engine.getAddress()
  }

  async getTransactionInfo (txid) {
    const node = selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getAccountBalances () {
    const node = selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(this._engine.getAddress())
    return { balance0, balance6 }
  }

  async transfer (to, amount: BigNumber) {
    const node = selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(this._engine.getAddress())
    const { tx /*, fee */ } = this._engine.createTransaction(to, amount, utxos)
    return await node.send(tx.toHex())
  }

  // eslint-disable-next-line
  async onTransaction (tx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx: tx
    })
    // TODO @ipavlenko: Implement using socket connection to our middleware
  }
}

export function selectNode (engine) {
  if (engine.getNetwork() === networks.testnet) return TESTNET
  return MAINNET
}

export default new BitcoinProvider()
