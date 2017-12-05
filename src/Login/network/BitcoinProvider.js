import type BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import { selectBCCNode, selectBTCNode, selectBTGNode, selectLTCNode } from './BitcoinNode'

export class BitcoinProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
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

export const btcProvider = new BitcoinProvider(selectBTCNode)
export const bccProvider = new BitcoinProvider(selectBCCNode)
export const btgProvider = new BitcoinProvider(selectBTGNode)
export const ltcProvider = new BitcoinProvider(selectLTCNode)
