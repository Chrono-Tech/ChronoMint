import BigNumber from 'bignumber.js'
// import TransferNoticeModel from 'models/notices/TransferNoticeModel'

import type TxModel from 'models/TxModel'
import type TokenModel from 'models/TokenModel'
import { nemAddress } from 'models/validator'

// const EVENT_TX = 'tx'
const EVENT_BALANCE = 'balance'

export default class NemDAO {

  constructor (name, symbol, nemProvider, mosaic, decimals) {
    this._name = name
    this._symbol = symbol
    this._mosaic = mosaic
    this._decimals = decimals
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
    return `Nem/${this._mosaic === null ? '' : this._mosaic}/${this._symbol}`
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

  getDecimals () {
    return this._decimals
  }

  async getFeeRate () {
    return this._nemProvider.getFeeRate()
  }

  async getAccountBalances () {
    const { balance, vestedBalance, unvestedBalance } = await this._nemProvider.getAccountBalances(this._mosaic)
    return {
      balance,
      vestedBalance,
      unvestedBalance,
    }
  }

  // eslint-disable-next-line no-unused-vars
  async transfer (to, amount: BigNumber, token: TokenModel, feeMultiplier: Number = 1) {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Nem transactions
  }

  // eslint-disable-next-line no-unused-vars
  async getTransfer (txid, account): Promise<Array<TxModel>> {
    // TODO @ipavlenko: Change the purpose of TxModel, add support of Nem transactions
    return []
  }

  // eslint-disable-next-line no-unused-vars
  async watchTransfer (callback) {
    // TODO @ipavlenko: Implement for XEM
    // this._nemProvider.addListener(EVENT_TX, async ({ account, time, tx }) => {
    //   callback(new TransferNoticeModel({
    //     account,
    //     time,
    //     tx: tx.set('symbol', this.getSymbol()),
    //   }))
    // })
  }

  async watchBalance (callback) {
    this._nemProvider.addListener(EVENT_BALANCE, async ({ account, time, balance }) => {
      const b = this._mosaic
        ? balance.balance
        : balance.mosaics[this._mosaic]
      callback({
        account,
        time,
        balance: b.div(this._decimals),
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
}
