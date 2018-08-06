/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type BigNumber from 'bignumber.js'
import bitcoin from 'bitcoinjs-lib'
import TxModel from '@chronobank/core/models/TxModel'
import Amount from '@chronobank/core/models/Amount'
import AbstractProvider from './AbstractProvider'
import { selectBCCNode, selectBTCNode, selectBTGNode, selectLTCNode } from './BitcoinNode'
import { BitcoinTx, BitcoinBalance } from './BitcoinAbstractNode'
import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
  COIN_TYPE_BTC_MAINNET,
  COIN_TYPE_BTC_TESTNET,
  COIN_TYPE_LTC_MAINNET,
  COIN_TYPE_LTC_TESTNET,
} from './constants'

export class BitcoinProvider extends AbstractProvider {
  constructor (selectNode, id) {
    super(...arguments)
    this._handleTransaction = (tx) => this.onTransaction(tx)
    this._handleBalance = (balance) => this.onBalance(balance)
    this._handleLastBlock = (lastBlock) => this.onLastBlock(lastBlock)
    this._handleTransactionUpdated = ( { tx, address, blockchain, symbol }) => this.onTransactionUpdated(tx, address, blockchain, symbol)
    this._id = id
  }

  subscribeNewWallet (address) {
    const node = this._selectNode(this._engine)
    node.subscribeNewWallet(address)
  }

  addDerivedWallet (wallet) {
    this._engine.addWallet(wallet)
  }

  subscribe (engine) {
    const node = super.subscribe(engine)
    node.addListener('tx', this._handleTransaction) // send transaction
    node.addListener('balance', this._handleBalance)
    node.addListener('lastBlock', this._handleLastBlock)
    node.addListener('transaction', this._handleTransactionUpdated) // transaction mained & added to pool.
  }

  unsubscribe (engine) {
    const node = super.unsubscribe(engine)
    node.removeListener('tx', this._handleTransaction)
    node.removeListener('balance', this._handleBalance)
    node.removeListener('lastBlock', this._handleLastBlock)
    node.removeListener('transaction', this._handleTransactionUpdated)
  }

  async getTransactionInfo (txid) {
    const node = this._selectNode(this._engine)
    return node.getTransactionInfo(txid)
  }

  async getTransactionsList (address, skip, offset) {
    const node = this._selectNode(this._engine)
    return node.getTransactionsList(address, this._id, skip, offset)
  }

  async getFeeRate () {
    const node = this._selectNode(this._engine)
    return node.getFeeRate()
  }

  async getCurrentBlockHeight () {
    const node = this._selectNode(this._engine)
    return node.getCurrentBlockHeight()
  }

  async getAccountBalances (address) {
    const node = this._selectNode(this._engine)
    const { balance0, balance6 } = await node.getAddressInfo(address || this._engine.getAddress())
    return { balance0, balance6 }
  }

  async estimateFee (from: string, to, amount: BigNumber, feeRate: Number) {
    const node = this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(from || this._engine.getAddress())
    const { fee } = this._engine.describeTransaction(to, amount, feeRate, utxos)
    return fee
  }

  async transfer (from: string, to, amount: BigNumber, feeRate: Number) {
    const node = this._selectNode(this._engine)
    const utxos = await node.getAddressUTXOS(from || this._engine.getAddress())
    const options = {
      from,
      feeRate,
    }
    const { tx /*, fee*/ } = this._engine.createTransaction(to, amount, utxos, options)
    return node.send(from, tx.toHex())
  }

  async onTransactionUpdated (txData, address, blockchain, symbol) {
    const node = this._selectNode(this._engine)
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
      blockchain: blockchain,
    })

    this.emit('transaction', {
      tx: txModel,
    })
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
      account: balance.address || this.getAddress(),
      time: new Date().getTime(),
      balance,
    })
  }

  async onLastBlock (lastBlock) {
    this.emit('lastBlock', { ...lastBlock })
  }

  getPrivateKey () {
    return this._engine ? this._engine.getPrivateKey() : null
  }

  createNewChildAddress (deriveNumber) {
    let coinType = null

    switch (this._id) {
      case BLOCKCHAIN_BITCOIN:
        coinType = this._engine._network === bitcoin.networks.testnet
          ? COIN_TYPE_BTC_TESTNET
          : COIN_TYPE_BTC_MAINNET
        break
      case BLOCKCHAIN_LITECOIN:
        coinType = this._engine._network === bitcoin.networks.litecoin_testnet
          ? COIN_TYPE_LTC_TESTNET
          : COIN_TYPE_LTC_MAINNET
        break
    }

    return this._engine && coinType ? this._engine.createNewChildAddress(deriveNumber, coinType) : null
  }
}

export const btcProvider = new BitcoinProvider(selectBTCNode, BLOCKCHAIN_BITCOIN)
export const bccProvider = new BitcoinProvider(selectBCCNode, BLOCKCHAIN_BITCOIN_CASH)
export const btgProvider = new BitcoinProvider(selectBTGNode, BLOCKCHAIN_BITCOIN_GOLD)
export const ltcProvider = new BitcoinProvider(selectLTCNode, BLOCKCHAIN_LITECOIN)
