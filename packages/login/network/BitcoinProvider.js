import type BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import { selectBCCNode, selectBTCNode, selectBTGNode, selectLTCNode } from './BitcoinNode'
import { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'

export const BLOCKCHAIN_BITCOIN = 'Bitcoin'
export const BLOCKCHAIN_BITCOIN_CASH = 'Bitcoin Cash'
export const BLOCKCHAIN_BITCOIN_GOLD = 'Bitcoin Gold'
export const BLOCKCHAIN_LITECOIN = 'Litecoin'

export class BitcoinProvider extends AbstractProvider {
  constructor (selectNode, id) {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = id
  }

  subscribe (engine) {
    const node = super.subscribe(engine)
    node.addListener('tx', this._handleTransaction)
    node.addListener('balance', this._handleBalance)
  }

  unsubscribe (engine) {
    const node = super.unsubscribe(engine)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
  }

  async getTransactionInfo (txid) {
    const node = this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getTransactionsList (address) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address)
  }

  async getFeeRate () {
    const node = this._selectNode(this._engine)
    return node.getFeeRate()
  }

  async getAccountBalances () {
    const node = this._selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(this._engine.getAddress())
    return { balance0, balance6 }
  }

  async transfer (from: string, to, amount: BigNumber, feeRate: Number) {
    const node = this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(this._engine.getAddress())
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, feeRate, utxos)
    return await node.send(from, tx.toHex())
  }

  async onTransaction (tx: BitcoinTx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: BitcoinBalance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance,
    })
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }
}

export const btcProvider = new BitcoinProvider(selectBTCNode, BLOCKCHAIN_BITCOIN)
export const bccProvider = new BitcoinProvider(selectBCCNode, BLOCKCHAIN_BITCOIN_CASH)
export const btgProvider = new BitcoinProvider(selectBTGNode, BLOCKCHAIN_BITCOIN_GOLD)
export const ltcProvider = new BitcoinProvider(selectLTCNode, BLOCKCHAIN_LITECOIN)
