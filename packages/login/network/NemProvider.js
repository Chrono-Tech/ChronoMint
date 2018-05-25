/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import { NemBalance, NemTx } from './NemAbstractNode'
import { selectNemNode } from './NemNode'

export class NemProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = 'NEM'
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
    return node.getMosaics() || []
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  async getAccountBalances (mosaic = null) {
    const node = this._selectNode(this._engine)
    const { balance, mosaics } = await node.getAddressInfo(this._engine.getAddress())
    if (mosaic) {
      return (mosaics && (mosaic in mosaics))
        ? mosaics[mosaic]
        : { confirmed: new BigNumber(0) } // When no such mosaic specified
    }
    return balance
  }

  async getTransactionsList (address, id, skip, offset) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address, id, skip, offset)
  }

  async estimateFee (from: string, to, amount: BigNumber, mosaicDefinition) {
    const { fee } = this._engine.describeTransaction(to, amount, mosaicDefinition)
    return fee
  }

  // eslint-disable-next-line
  async transfer (from: string, to: string, amount: BigNumber, mosaicDefinition, feeMultiplier: Number) {
    // TODO @ipavlenko: Implement for XEM and Mosaics
    const node = this._selectNode(this._engine)
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, mosaicDefinition)
    return node.send(from, tx)
  }

  async onTransaction (tx: NemTx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: NemBalance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance, // structured for NEM
    })
  }
}

export const nemProvider = new NemProvider(selectNemNode)
