/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  bccProvider,
  btcProvider,
  btgProvider,
  ltcProvider,
} from '@chronobank/login/network/BitcoinProvider'
import EventEmitter from 'events'
import BigNumber from 'bignumber.js'
import Amount from '../models/Amount'
import TokenModel from '../models/tokens/TokenModel'
import TxModel from '../models/TxModel'
import TransferExecModel from '../models/TransferExecModel'
import { bitcoinAddress } from '../models/validator'

//#region CONSTANTS

import {
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
  EVENT_NEW_TRANSFER,
  EVENT_UPDATE_BALANCE,
  EVENT_UPDATE_LAST_BLOCK,
  EVENT_UPDATE_TRANSACTION,
} from './constants'

//#endregion CONSTANTS

const EVENT_TX = 'tx'
const EVENT_TRANSACTION_MAINED = 'transaction'
const EVENT_BALANCE = 'balance'
const EVENT_LAST_BLOCK = 'lastBlock'

export default class BitcoinDAO extends EventEmitter {
  constructor (name, symbol, bitcoinProvider) {
    super()
    this._name = name
    this._symbol = symbol
    this._bitcoinProvider = bitcoinProvider
    this._decimals = 8
  }

  getBlockchain () {
    return this._name
  }

  getAddressValidator () {
    return bitcoinAddress(this._bitcoinProvider.isAddressValid.bind(this._bitcoinProvider), this._name)
  }

  getAccount () {
    return this._bitcoinProvider.getAddress()
  }

  getInitAddress () {
    // BitcoinDAO is not a cntract DAO, bitcoin have no initial address, but it have a token name.
    return `Bitcoin/${this._symbol}`
  }

  getCurrentBlockHeight () {
    return this._bitcoinProvider.getCurrentBlockHeight()
  }

  isInitialized () {
    return this._bitcoinProvider.isInitialized()
  }

  hasBalancesStream () {
    // Balance should not be fetched after transfer notification,
    // it will be updated from the balances event stream
    return true
  }

  async getFeeRate () {
    return this._bitcoinProvider.getFeeRate()
  }

  async getAccountBalances (address) {
    const { balance0, balance6 } = await this._bitcoinProvider.getAccountBalances(address)
    return {
      balance: balance0 || balance6,
    }
  }

  async getAccountBalance (address) {
    const balances = await this.getAccountBalances(address)
    return balances.balance
  }

  accept (transfer: TransferExecModel) {
    setImmediate(() => {
      this.emit('accept', transfer)
    })
  }

  reject (transfer: TransferExecModel) {
    setImmediate(() => {
      this.emit('reject', transfer)
    })
  }

  // TODO @ipavlenko: Replace with 'immediateTransfer' after all token DAOs will start using 'submit' method
  transfer (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1, advancedParams = undefined) {
    this.submit(from, to, amount, token, feeMultiplier, advancedParams)
  }

  submit (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1, advancedParams) {
    const tokenFeeRate = advancedParams && advancedParams.satPerByte ? advancedParams.satPerByte : token.feeRate()
    setImmediate(async () => {
      const fee = await this._bitcoinProvider.estimateFee(from, to, amount, tokenFeeRate) // use feeMultiplier = 1 to estimate default fee
      this.emit('submit', new TransferExecModel({
        title: `tx.Bitcoin.${this._name}.transfer.title`,
        from,
        to,
        amount: new Amount(amount, token.symbol()),
        amountToken: token,
        fee: new Amount(fee, token.symbol()),
        feeToken: token,
        feeMultiplier,
        options: {
          advancedParams,
        },
      }))
    })
  }

  // TODO @ipavlenko: Rename to 'transfer' after all token DAOs will start using 'submit' method and 'trans'
  async immediateTransfer (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1, advancedParams = undefined) {
    try {
      const tokenRate = advancedParams && advancedParams.satPerByte ? advancedParams.satPerByte : feeMultiplier * token.feeRate()
      return await this._bitcoinProvider.transfer(from, to, amount, tokenRate)
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
  }

  async getTransfer (id, account, skip, offset): Array<TxModel> {
    let txs = []
    try {
      const txsResult = await this._bitcoinProvider.getTransactionsList(account, skip, offset)
      for (const tx of txsResult) {
        txs.push(new TxModel({
          txHash: tx.txHash,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          confirmations: tx.confirmations,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          symbol: this._symbol,
          value: new Amount(tx.value, this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          blockchain: this._name,
        }))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.warn('BitcoinDAO getTransfer', e)
    }

    return txs
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
      this.watchTransaction(),
    ])
  }

  async watchTransaction () {
    this._bitcoinProvider.addListener(EVENT_TRANSACTION_MAINED, async ({ tx, address, bitcoin, symbol }) => {
      this.emit(
        EVENT_UPDATE_TRANSACTION,
        {
          tx,
          address,
          bitcoin,
          symbol,
        },
      )
    })
  }

  async watchTransfer () {
    this._bitcoinProvider.addListener(EVENT_TX, async ({ tx }) => {
      this.emit(
        EVENT_NEW_TRANSFER,
        new TxModel({
          txHash: tx.txHash,
          // blockHash: tx.blockhash,
          // blockNumber: tx.blockheight,
          blockNumber: null,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          symbol: this._symbol,
          value: new Amount(tx.value, this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          blockchain: this._name,
        }),
      )
    })
  }

  async watchBalance () {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, { account, time, balance: balance.balance0 })
    })
  }

  async watchLastBlock () {
    this._bitcoinProvider.addListener(EVENT_LAST_BLOCK, async ({ block }) => {
      this.emit(EVENT_UPDATE_LAST_BLOCK, {
        blockchain: this._name,
        block: { blockNumber: block },
      })
    })
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
    const feeRate = await this.getFeeRate()

    return new TokenModel({
      name: this._name,
      decimals: this._decimals,
      symbol: this._symbol,
      isFetched: true,
      blockchain: this._name,
      feeRate,
    })
  }

  subscribeNewWallet (address) {
    this._bitcoinProvider.subscribeNewWallet(address)
  }
}

export const btcDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN, 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_CASH, 'BCC', bccProvider)
export const btgDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_GOLD, 'BTG', btgProvider)
export const ltcDAO = new BitcoinDAO(BLOCKCHAIN_LITECOIN, 'LTC', ltcProvider)
