import { bccProvider, btcProvider, btgProvider, ltcProvider, BLOCKCHAIN_BITCOIN, BLOCKCHAIN_BITCOIN_CASH, BLOCKCHAIN_BITCOIN_GOLD, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import TokenModel from 'models/tokens/TokenModel'
import type TxModel from 'models/TxModel'
import { bitcoinAddress } from 'models/validator'
import { EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE } from './AbstractTokenDAO'

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'
export const EVENT_BTC_LIKE_TOKEN_CREATED = 'BtcLikeTokenCreate'
export const EVENT_BTC_LIKE_TOKEN_FAILED = 'BtcLikeTokenFailed'

export class BitcoinDAO extends EventEmitter {
  constructor (name, symbol, bitcoinProvider) {
    super()
    this._name = name
    this._symbol = symbol
    this._bitcoinProvider = bitcoinProvider
    this._decimals = 8
  }

  getAddressValidator () {
    return bitcoinAddress
  }

  getAccount () {
    return this._bitcoinProvider.getAddress()
  }

  getInitAddress () {
    // BitcoinDAO is not a cntract DAO, bitcoin have no initial address, but it have a token name.
    return `Bitcoin/${this._symbol}`
  }

  isInitialized () {
    return this._bitcoinProvider.isInitialized()
  }

  async getFeeRate () {
    return this._bitcoinProvider.getFeeRate()
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await this._bitcoinProvider.getAccountBalances()
    return {
      balance: balance0 || balance6,
      balance0: balance0,
      balance6: balance6,
    }
  }

  async getAccountBalance () {
    const balances = await this.getAccountBalances()
    return balances.balance
  }

  async transfer (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1) {
    try {
      return await this._bitcoinProvider.transfer(from, to, amount, feeMultiplier * token.feeRate())
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e.message)
      throw e
    }
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account): Promise<Array<TxModel>> {
    console.log(id, account)
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
    return []
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
    ])
  }

  async watchTransfer () {
    this._bitcoinProvider.addListener(EVENT_TX, async ({ tx }) => {
      this.emit(EVENT_NEW_TRANSFER, tx)
    })
  }

  async watchBalance () {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, balance)
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
      this.emit(EVENT_BTC_LIKE_TOKEN_FAILED)
      console.warn(`${this._symbol} not initialized`)
      return
    }
    const feeRate = await this.getFeeRate()

    this.emit(EVENT_BTC_LIKE_TOKEN_CREATED, new TokenModel({
      name: this._name,
      symbol: this._symbol,
      isOptional: false,
      isFetched: true,
      blockchain: this._name,
      feeRate,
    }), this)
  }
}

export const btcDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN, 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_CASH, 'BCC', bccProvider)
export const btgDAO = new BitcoinDAO(BLOCKCHAIN_BITCOIN_GOLD, 'BTG', btgProvider)
export const ltcDAO = new BitcoinDAO(BLOCKCHAIN_LITECOIN, 'LTC', ltcProvider)
