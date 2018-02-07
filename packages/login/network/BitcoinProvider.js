import type BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import {
  BTC_TESTNET_NODE, BTC_MAINNET_NODE,
  BCC_MAINNET_NODE, BCC_TESTNET_NODE,
  BTG_TESTNET_NODE, BTG_MAINNET_NODE,
  LTC_TESTNET_NODE, LTC_MAINNET_NODE,
} from './BitcoinNode'
import { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'
import NodeProxy from './NodeProxy'

export const BLOCKCHAIN_BITCOIN = 'Bitcoin'
export const BLOCKCHAIN_BITCOIN_CASH = 'Bitcoin Cash'
export const BLOCKCHAIN_BITCOIN_GOLD = 'Bitcoin Gold'
export const BLOCKCHAIN_LITECOIN = 'Litecoin'

export class BitcoinProvider extends AbstractProvider {
  constructor (selectNode, id, nodeProxy) {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = id
    this._nodeProxy = nodeProxy
  }

  subscribe (engine) {
    const node = this._nodeProxy ? this._nodeProxy.subscribe(engine) : super.subscribe(engine)
    node.addListener('tx', this._handleTransaction)
    node.addListener('balance', this._handleBalance)
  }

  unsubscribe (engine) {
    const node = this._nodeProxy ? this._nodeProxy.unsubscribe(engine) : super.unsubscribe(engine)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
  }

  getTransactionInfo (txid) {
    const node = this._nodeProxy || this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  getTransactionsList (address) {
    const node = this._nodeProxy || this._selectNode(this._engine)
    return node.getTransactionsList(address)
  }

  getFeeRate () {
    const node = this._nodeProxy || this._selectNode(this._engine)
    return node.getFeeRate()
  }

  async getAccountBalances () {
    const node = this._nodeProxy || this._selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(this._engine.getAddress())
    // eslint-disable-next-line
    console.log('getAccountBalances', +balance0, +balance6)
    return { balance0, balance6 }
  }

  async transfer (from: string, to, amount: BigNumber, feeRate: Number) {
    const node = this._nodeProxy || this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(this._engine.getAddress())
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, feeRate, utxos)
    const result = await node.send(from, tx.toHex())
    return result
  }

  onTransaction (tx: BitcoinTx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  onBalance (balance: BitcoinBalance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance,
    })
  }
}

export const btcProvider = new BitcoinProvider(null, BLOCKCHAIN_BITCOIN, new NodeProxy(BTC_TESTNET_NODE, BTC_MAINNET_NODE))
export const bccProvider = new BitcoinProvider(null, BLOCKCHAIN_BITCOIN_CASH, new NodeProxy(BCC_TESTNET_NODE, BCC_MAINNET_NODE))
export const btgProvider = new BitcoinProvider(null, BLOCKCHAIN_BITCOIN_GOLD, new NodeProxy(BTG_TESTNET_NODE, BTG_MAINNET_NODE))
export const ltcProvider = new BitcoinProvider(null, BLOCKCHAIN_LITECOIN, new NodeProxy(LTC_TESTNET_NODE, LTC_MAINNET_NODE))
