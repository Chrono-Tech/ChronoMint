import {
  bccProvider,
  btcProvider,
  btgProvider,
  ltcProvider,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/BitcoinProvider'
import { DECIMALS } from '@chronobank/login/network/BitcoinEngine'
import { BitcoinTx } from '@chronobank/login/network/BitcoinAbstractNode'
import BigNumber from 'bignumber.js'
import EventEmitter from 'events'
import Amount from 'models/Amount'
import TokenModel from 'models/tokens/TokenModel'
import TxModel from 'models/TxModel'
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
    return bitcoinAddress(this._bitcoinProvider.isAddressValid.bind(this._bitcoinProvider), this._name)
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

  hasBalancesStream () {
    // Balance should not be fetched after transfer notification,
    // it will be updated from the balances event stream
    return true
  }

  async getFeeRate () {
    return this._bitcoinProvider.getFeeRate()
  }

  async getAccountBalances () {
    const { balance0, balance6 } = await this._bitcoinProvider.getAccountBalances()
    return {
      balance: balance0 || balance6,
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
      console.log('Transfer failed', e)
      throw e
    }
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (id, account): Array<TxModel> {
    try {
      const txs = await this._bitcoinProvider.getTransactionsList(account)
      return (txs || []).map((tx: BitcoinTx) => {
        // eslint-disable-next-line
        console.log('', {
          txHash: tx.txHash,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          value: new Amount(tx.value.mul(DECIMALS), this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          credited: tx.credited,
        })
        return new TxModel({
          txHash: tx.txHash,
          blockHash: tx.blockHash,
          blockNumber: tx.blockNumber,
          time: tx.time,
          from: tx.from,
          to: tx.to,
          value: new Amount(tx.value.mul(DECIMALS), this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          credited: tx.credited,
        })
      })
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Bitcoin transactions
  }

  watch (/*account*/): Promise {
    return Promise.all([
      this.watchTransfer(),
      this.watchBalance(),
    ])
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
          value: new Amount(tx.value, this._symbol),
          fee: new Amount(tx.fee, this._symbol),
          credited: tx.credited,
        }),
      )
    })
  }

  async watchBalance () {
    this._bitcoinProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      this.emit(EVENT_UPDATE_BALANCE, { account, time, balance: balance.balance0 })
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
      // eslint-disable-next-line
      console.warn(`${this._symbol} not initialized`)
      return
    }
    const feeRate = await this.getFeeRate()

    this.emit(EVENT_BTC_LIKE_TOKEN_CREATED, new TokenModel({
      name: this._name,
      decimals: this._decimals,
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
