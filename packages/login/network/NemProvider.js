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
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionInfo(txid)
  }

  async getFeeRate () {
    const node = this._selectNode(this.networkSettings)
    return node.getFeeRate()
  }

  getMosaics () {
    const node = this._selectNode(this.networkSettings)
    return node.getMosaics() || []
  }

  async getAccountBalances (address, mosaic = null) {
    const node = this._selectNode(this.networkSettings)
    const { mosaics, balance: accountBalance } = await node.getAddressInfo(address)
    let balance = accountBalance

    if (mosaic) {
      balance = (mosaics && (mosaic in mosaics))
        ? mosaics[mosaic]
        : { unconfirmed: new BigNumber(0) } // When no such mosaic specified
    }

    if (!balance) return null

    return balance.unconfirmed
  }

  async getTransactionsList (address, id, skip, offset) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionsList(address, id, skip, offset)
  }

  getNode () {
    return this._selectNode(this.networkSettings)
  }

  async onTransaction (tx: NemTx, address) {
    this.emit('tx', {
      account: address,
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: NemBalance) {
    this.emit('balance', {
      account: balance.address,
      time: new Date().getTime(),
      balance,
    })
  }
}

export const nemProvider = new NemProvider(selectNemNode)
