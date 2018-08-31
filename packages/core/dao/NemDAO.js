/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import Amount from '../models/Amount'
import { nemAddress } from '../models/validator'
import { BLOCKCHAIN_NEM, EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE } from './constants'
import { NEM_XEM_SYMBOL } from './constants/NemDAO'

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export default class NemDAO extends EventEmitter {

  constructor (name, symbol, nemProvider, decimals, mosaic, nemToken) {
    super()
    // nemToken only available for mosaics, it should be used as a fee token
    this._nemToken = nemToken
    this._name = name
    this._symbol = symbol.toUpperCase()
    this._namespace = mosaic ? `${mosaic.id.namespaceId}:${mosaic.id.name}` : null
    this._decimals = decimals
    this._mosaic = mosaic
    this._nemProvider = nemProvider
  }

  getAddressValidator () {
    return nemAddress
  }

  getAccount () {
    return this._nemProvider.getAddress()
  }

  getInitAddress () {
    // NemDAO is not a cntract DAO, NEM have no initial address, but it have a token name.
    return `Nem/${this._namespace === null ? '' : this._namespace}/${this._symbol}`
  }

  getName () {
    return this._name
  }

  getSymbol () {
    return this._symbol
  }

  isApproveRequired () {
    return false
  }

  isInitialized () {
    return this._nemProvider.isInitialized()
  }

  hasBalancesStream () {
    // Balance should not be fetched after transfer notification,
    // it will be updated from the balances event stream
    return true
  }

  getDecimals () {
    return this._decimals
  }

  getAccountBalances () {
    return this._nemProvider.getAccountBalances(this._namespace)
  }

  /**
   * wrapper for getAccountBalances, is required for uniformity os DAOs
   * @returns {*|Promise<*>}
   */
  getAccountBalance () {
    return this.getAccountBalances()
  }

  transfer (from: string, to: string, amount: BigNumber, token: TokenModel) {
    return {
      from,
      to,
      amount: new Amount(amount, token.symbol()),
      mosaicDefinition: this._mosaic,
    }
  }

  async getTransfer (id, account, skip, offset): Promise<Array<TxModel>> {
    const txs = []
    try {
      const txsResult = await this._nemProvider.getTransactionsList(account, id, skip, offset)
      for (const tx of txsResult) {
        if (tx.value > 0) {
          txs.push(new TxModel({
            txHash: tx.txHash,
            blockHash: tx.blockHash,
            blockNumber: tx.blockNumber,
            time: tx.time,
            from: tx.from,
            to: tx.to,
            symbol: this._symbol,
            value: new Amount(tx.value, this._symbol),
            fee: new Amount(tx.fee, this._symbol),
            blockchain: BLOCKCHAIN_NEM,
          }))
        }
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('NemDAO getTransfer', e)
    }
    return txs
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
    ])
  }

  async watchTransfer () {
    this._nemProvider.addListener(EVENT_TX, async ({ tx }) => {
      if (tx.unconfirmed) {
        if (!this._mosaic) {
          if (!tx.mosaics) {
            this.emit(EVENT_NEW_TRANSFER, this._createXemTxModel(tx))
          }
        } else {
          if (tx.mosaics && (this._namespace in tx.mosaics)) {
            this.emit(EVENT_NEW_TRANSFER, this._createMosaicTxModel(tx))
          }
        }
      }
    })
  }

  _createXemTxModel (tx) {
    return new TxModel({
      txHash: tx.txHash,
      // blockHash: tx.blockhash,
      // blockNumber: tx.blockheight,
      blockNumber: null,
      time: tx.time,
      from: tx.from || tx.signer,
      to: tx.to,
      value: new Amount(tx.value, this._symbol),
      fee: new Amount(tx.fee, this._symbol),
      blockchain: BLOCKCHAIN_NEM,
    })
  }

  _createMosaicTxModel (tx) {
    return new TxModel({
      txHash: tx.txHash,
      // blockHash: tx.blockhash,
      // blockNumber: tx.blockheight,
      blockNumber: null,
      time: tx.time,
      from: tx.from || tx.signer,
      to: tx.to,
      value: new Amount(tx.mosaics[this._namespace], this._symbol),
      fee: new Amount(tx.fee, NEM_XEM_SYMBOL),
      blockchain: BLOCKCHAIN_NEM,
    })
  }

  async watchBalance () {
    this._nemProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, {
        account,
        time,
        balance: readBalanceValue(this._symbol, balance, this._namespace),
      })
    })
  }

  // eslint-disable-next-line no-unused-vars
  async watchApproval (callback) {
    // Ignore
  }

  async stopWatching () {
    // Ignore
  }

  resetFilterCache () {
    // do nothing
  }

  async fetchToken () {
    if (!this.isInitialized()) {
      const message = `${this._symbol} support is not available`
      // eslint-disable-next-line
      console.warn(message)
      throw new Error(message)
    }

    const token = new TokenModel({
      name: this._name,
      decimals: this._decimals,
      symbol: this._symbol,
      isFetched: true,
      blockchain: BLOCKCHAIN_NEM,
    })

    return token
  }
}

function readBalanceValue (symbol, balance, mosaic = null) {
  if (mosaic) {
    return (mosaic in balance.mosaics)
      ? (
        balance.mosaics[mosaic].unconfirmed != null // nil check
          ? balance.mosaics[mosaic].unconfirmed
          : balance.mosaics[mosaic].confirmed
      )
      : new Amount(0, symbol)
  }
  const b = balance.balance
  return b.unconfirmed != null // nil check
    ? b.unconfirmed
    : b.confirmed
}
