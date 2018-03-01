import { TXS_PER_PAGE } from 'models/wallet/TransactionsCollection'
import BigNumber from 'bignumber.js'
import TokenModel from 'models/tokens/TokenModel'
import TxModel from 'models/TxModel'
import Amount from 'models/Amount'
import { nemAddress } from 'models/validator'
import { EVENT_NEW_TRANSFER, EVENT_UPDATE_BALANCE } from 'dao/AbstractTokenDAO'
import AbstractContractDAO from './AbstractContractDAO'

const BLOCKCHAIN_NEM = 'NEM'
export const NEM_XEM_SYMBOL = 'XEM'
export const NEM_XEM_NAME = 'XEM'
export const NEM_DECIMALS = 6

const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export const EVENT_NEM_LIKE_TOKEN_CREATED = 'nemLikeTokenCreated'
export const EVENT_NEM_LIKE_TOKEN_FAILED = 'nemLikeTokenFailed'

export default class NemDAO extends AbstractContractDAO {

  constructor (name, symbol, nemProvider, decimals, mosaic) {
    super()
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

  async getAccountBalances () {
    const { confirmed, unconfirmed, vested } = await this._nemProvider.getAccountBalances(this._namespace)
    return {
      confirmed,
      unconfirmed: unconfirmed != null
        ? unconfirmed
        : confirmed,
      vested,
    }
  }

  async getAccountBalance () {
    const { unconfirmed } = await this.getAccountBalances()
    return unconfirmed
  }

  // eslint-disable-next-line no-unused-vars
  async transfer (from: string, to: string, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1) {
    try {
      return await this._nemProvider.transfer(from, to, amount, this._mosaic, feeMultiplier)
    } catch (e) {
      // eslint-disable-next-line
      console.log('Transfer failed', e)
      throw e
    }
  }

  async getTransfer (id, account): Promise<Array<TxModel>> {
    const offset = 100 // limit
    const cache = this._getFilterCache(id) || {}
    const txs = cache.txs || []
    let page = cache.page || 1
    let end = cache.end || false
    const skip = txs.length

    try {
      const txsResult = await this._nemProvider.getTransactionsList(account, id, skip, offset)
      if (txsResult.length < TXS_PER_PAGE) {
        end = true
      }
      for (const tx of txsResult) {
        // TODO @abdulov now, it not worked, blocked by Middleware
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
          credited: tx.credited,
        }))
      }
    } catch (e) {
      end = true
      // eslint-disable-next-line
      console.warn('BitcoinDAO getTransfer', e)
    }
    page++

    this._setFilterCache(id, {
      page, txs, end,
    })

    return txs.slice(skip)
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
      credited: tx.credited,
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
      value: new Amount(tx.mosaics[ this._namespace ], this._symbol),
      fee: new Amount(tx.fee, NEM_XEM_SYMBOL),
      credited: tx.credited,
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

  fetchToken () {
    if (!this.isInitialized()) {
      // eslint-disable-next-line
      console.warn(`${this._name} support is not available`)
      this.emit(EVENT_NEM_LIKE_TOKEN_FAILED)
      return
    }

    this.emit(EVENT_NEM_LIKE_TOKEN_CREATED, new TokenModel({
      name: this._name,
      decimals: this._decimals,
      symbol: this._symbol,
      isOptional: false,
      isFetched: true,
      blockchain: BLOCKCHAIN_NEM,
    }), this)
  }
}

function readBalanceValue (symbol, balance, mosaic = null) {
  if (mosaic) {
    return (mosaic in balance.mosaics)
      ? (
        balance.mosaics[ mosaic ].unconfirmed != null // nil check
          ? balance.mosaics[ mosaic ].unconfirmed
          : balance.mosaics[ mosaic ].confirmed
      )
      : new Amount(0, symbol)
  }
  const b = balance.balance
  return b.unconfirmed != null // nil check
    ? b.unconfirmed
    : b.confirmed
}
