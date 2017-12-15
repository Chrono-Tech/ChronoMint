import type BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'

import { selectNemNode } from './NemNode'

export class NemProvider extends AbstractProvider {
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

  async getFeeRate () {
    const node = this._selectNode(this._engine)
    return node.getFeeRate()
  }

  getMosaics () {
    const node = this._selectNode(this._engine)
    return node.getMosaics()
  }

  async getAccountBalances (mosaic = null) {
    const node = this._selectNode(this._engine)
    const { balance, mosaics } = await node.getAddressInfo(this._engine.getAddress())
    console.log(balance, mosaics, mosaic)
    return mosaic === null
      ? { balance }
      : { balance: mosaics[mosaic] }
  }

  // eslint-disable-next-line
  async transfer (to, amount: BigNumber, feeRate: Number) {
    // TODO @ipavlenko: Implement for XEM and Mosaics
    throw new Error('Not implemented')
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
      balance, // structured for NEM
    })
  }
}

export const nemProvider = new NemProvider(selectNemNode)
