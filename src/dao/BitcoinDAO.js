import { DECIMALS } from '@chronobank/login/network/BitcoinEngine'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import TransferNoticeModel from 'models/notices/TransferNoticeModel'
import TokenModel from 'models/tokens/TokenModel'
import type TxModel from 'models/TxModel'
import { bitcoinAddress } from 'models/validator'

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

  getName () {
    return this._name
  }

  getSymbol () {
    return this._symbol
  }

  isInitialized () {
    return this._bitcoinProvider.isInitialized()
  }

  getDecimals () {
    return 8
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

  async transfer (to, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1) {
    try {
      return await this._bitcoinProvider.transfer(to, amount, feeMultiplier * token.feeRate())
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e.message)
      throw e
    }
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account = this.getAccount()): Promise<Array<TxModel>> {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
    return []
  }

  async watchTransfer (callback) {
    this._bitcoinProvider.addListener(EVENT_TX, async ({ account, time, tx }) => {
      callback(new TransferNoticeModel({
        account,
        time,
        tx: tx.token(this.getSymbol()),
      }))
    })
  }

  async watchBalance (callback) {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      callback({
        account,
        time,
        balance: balance.balance0.div(DECIMALS),
        symbol: this.getSymbol(),
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

export const btcDAO = new BitcoinDAO('Bitcoin', 'BTC', btcProvider)
export const bccDAO = new BitcoinDAO('Bitcoin Cash', 'BCC', bccProvider)
export const ltcDAO = new BitcoinDAO('Litecoin', 'LTC', ltcProvider)
export const btgDAO = new BitcoinDAO('Bitcoin Gold ', 'BTG', btgProvider)
