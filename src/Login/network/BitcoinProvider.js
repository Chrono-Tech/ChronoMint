import type BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import { networks } from 'bitcoinjs-lib'

import { BitcoinEngine } from './BitcoinEngine'
import { MAINNET, TESTNET, MAINNET_BCC, TESTNET_BCC } from './BitcoinNode'

export class BitcoinProvider extends EventEmitter {
  constructor (selectNode) {
    super()
    this._selectNode = selectNode
    this._handleTransaction = tx => this.onTransaction(tx)
    this._handleBalance = balance => this.onBalance(balance)
  }

  isInitialized () {
    return this._engine != null
  }

  subscribe (engine) {
    const node = this._selectNode(engine)
    node.emit('subscribe', engine.getAddress())
    node.addListener('tx', this._handleTransaction)
    node.addListener('balance', this._handleBalance)
  }

  unsubscribe (engine) {
    const node = this._selectNode(engine)
    node.emit('unsubscribe', engine.getAddress())
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
  }

  setEngine (engine: BitcoinEngine) {
    this._engine && this.unsubscribe(this._engine)
    this._engine = engine
    this.subscribe(this._engine)
  }

  getAddress () {
    return this._engine && this._engine.getAddress() || null
  }

  async getTransactionInfo (txid) {
    const node = this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getAccountBalances () {
    const node = this._selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(this._engine.getAddress())
    return { balance0, balance6 }
  }

  async transfer (to, amount: BigNumber) {
    const node = this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(this._engine.getAddress())
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, utxos)
    return await node.send(this.getAddress(), tx.toHex())
  }

  async onTransaction (tx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance,
    })
  }
}

export function selectBTCNode (engine) {
  if (engine.getNetwork() === networks.testnet) return TESTNET
  return MAINNET
}

export function selectBCCNode (engine) {
  if (engine.getNetwork() === networks.testnet) return TESTNET_BCC
  return MAINNET_BCC
}

export const btcProvider = new BitcoinProvider(selectBTCNode)
export const bccProvider = new BitcoinProvider(selectBCCNode)
