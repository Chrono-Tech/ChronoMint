/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TxModel from '@chronobank/core/models/TxModel'
import Amount from '@chronobank/core/models/Amount'
import AbstractProvider from './AbstractProvider'
import { selectBCCNode, selectBTCNode, selectLTCNode } from './BitcoinNode'
import { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'
import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
} from './constants'

export class BitcoinProvider extends AbstractProvider {
  constructor (selectNode, id) {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._handleLastBlock = (lastBlock) => this.onLastBlock(lastBlock)
    this._handleTransactionUpdated = ({ tx, address, blockchain, symbol }) => this.onTransactionUpdated(tx, address, blockchain, symbol)
    this._id = id
  }

  subscribeNewWallet (address) {
    const node = this._selectNode(this.networkSettings)
    node.subscribeNewWallet(address)
  }

  addDerivedWallet (wallet) {
    this.networkSettings.addWallet(wallet)
  }

  subscribe (address) {
    const node = super.subscribe(address)
    node.addListener('tx', this._handleTransaction) // send transaction
    node.addListener('balance', this._handleBalance)
    node.addListener('lastBlock', this._handleLastBlock)
    node.addListener('transaction', this._handleTransactionUpdated) // transaction mained & added to pool.
  }

  unsubscribe (address) {
    const node = super.unsubscribe(address)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
    node.removeListener('lastBlock', this._handleLastBlock)
    node.removeListener('transaction', this._handleTransactionUpdated)
  }

  async getTransactionInfo (transactionId) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionInfo(transactionId)
  }

  async getTransactionsList (address, skip, offset) {
    const node = this._selectNode(this.networkSettings)
    return node.getTransactionsList(address, this._id, skip, offset)
  }

  async getFeeRate () {
    const node = this._selectNode(this.networkSettings)
    return node.getFeeRate()
  }

  async getCurrentBlockHeight () {
    const node = this._selectNode(this.networkSettings)
    return node.getCurrentBlockHeight()
  }

  async getAccountBalances (address) {
    const node = this._selectNode(this.networkSettings)
    const result = await node.getAddressInfo(address || this.networkSettings.getAddress())
    const { balance0, balance6 } = result
    return balance0 || balance6
  }

  async onTransactionUpdated (txData, address, blockchain, symbol) {
    const node = this._selectNode(this.networkSettings)
    const tx = node._createTxModel(txData, address)
    const txModel = new TxModel({
      txHash: tx.txHash,
      blockHash: tx.blockHash,
      blockNumber: tx.blockNumber,
      confirmations: tx.confirmations,
      time: tx.time,
      from: tx.from,
      to: tx.to,
      symbol: symbol,
      value: new Amount(tx.value, symbol),
      fee: new Amount(tx.fee, symbol),
      blockchain,
    })

    this.emit('transaction', {
      tx: txModel,
    })
  }

  async onTransaction (tx: BitcoinTx, address) {
    this.emit('tx', {
      account: address,
      time: new Date().getTime(),
      tx,
    })
  }

  async onBalance (balance: BitcoinBalance) {
    this.emit('balance', {
      account: balance.address,
      time: new Date().getTime(),
      balance,
    })
  }

  async onLastBlock (lastBlock) {
    this.emit('lastBlock', { ...lastBlock })
  }

  createNewChildAddress () {
    // @todo rewrite when HD wallet is required
    return null
  }

  getNode () {
    return this._selectNode(this.networkSettings)
  }
}

export const btcProvider = new BitcoinProvider(selectBTCNode, BLOCKCHAIN_BITCOIN)
export const bccProvider = new BitcoinProvider(selectBCCNode, BLOCKCHAIN_BITCOIN_CASH)
export const ltcProvider = new BitcoinProvider(selectLTCNode, BLOCKCHAIN_LITECOIN)
