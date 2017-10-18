import type BigNumber from 'BigNumber.js'
import EventEmitter from 'events'
import { networks } from 'bitcoinjs-lib'

import { BitcoinEngine } from './BitcoinEngine'
import { MAINNET, TESTNET, MAINNET_BCC, TESTNET_BCC } from './BitcoinNode'

export class BitcoinProvider extends EventEmitter {
  constructor(selectNode) {
    super()
    this._selectNode = selectNode
    this._handleTransaction = tx => this.onTransaction(tx)
  }

  isInitialized() {
    return this._engine != null
  }

  subscribe(engine) {
    const node = this._selectNode(engine)
    node.emit('subscribe', engine.getAddress())
    node.addListener('tx', this._handleTransaction)
  }

  unsubscribe(engine) {
    const node = this._selectNode(engine)
    node.emit('unsubscribe', engine.getAddress())
    node.removeListener('tx', this._handleTransaction)
  }

  setEngine(engine: BitcoinEngine) {
    this._engine && this.unsubscribe(this._engine)
    this._engine = engine
    this.subscribe(this._engine)
  }

  getAddress() {
    return this._engine && this._engine.getAddress() || null
  }

  async getTransactionInfo(txid) {
    const node = this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getAccountBalances() {
    const node = this._selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(this._engine.getAddress())
    return { balance0, balance6 }
  }

  async transfer(to, amount: BigNumber) {
    const node = this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(this._engine.getAddress())
    const { tx /* , fee */ } = this._engine.createTransaction(to, amount, utxos)
    return await node.send(tx.toHex())
  }

  // eslint-disable-next-line
  async onTransaction (tx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
    // TODO @ipavlenko: Implement using socket connection to our middleware
  }
}

export function selectBTCNode(engine) {
  if (engine.getNetwork() === networks.testnet) return TESTNET
  return MAINNET
}

export function selectBCCNode(engine) {
  if (engine.getNetwork() === networks.testnet) return TESTNET_BCC
  return MAINNET_BCC
}

export const btcProvider = new BitcoinProvider(selectBTCNode)
export const bccProvider = new BitcoinProvider(selectBCCNode)
