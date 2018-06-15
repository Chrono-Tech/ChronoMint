/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import AbstractProvider from './AbstractProvider'
import { WavesBalance, WavesTx } from './WavesAbstractNode'
import { selectWavesNode } from './WavesNode'

export class WavesProvider extends AbstractProvider {
  constructor () {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._id = 'WAVES'
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

  getAssets () {
    const node = this._selectNode(this._engine)
    return node.getAssets() || []
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  async getAccountBalances (asset) {
    const node = this._selectNode(this._engine)
    const { balance, assets } = await node.getAddressInfo(this._engine.getAddress())
    //if (assets) {
    //  return assets[asset]
    //}
    return balance
  }

  async getTransactionsList (address, id, skip, offset) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address, id, skip, offset)
  }

  // eslint-disable-next-line
  async transfer (from: string, to: string, amount: BigNumber, asset) {
    const node = this._selectNode(this._engine)
    const tx = await this._engine.createTransaction('TRANSFER', {to:to, amount:amount.toNumber(), asset:asset})
    return node.send(from, tx)
  }

  async onTransaction (tx: WavesTx) {
    this.emit('tx', {
      account: this.getAddress(),
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: WavesBalance) {
    this.emit('balance', {
      account: this.getAddress(),
      time: new Date().getTime(),
      balance,
    })
  }
}

export const wavesProvider = new WavesProvider(selectWavesNode)
