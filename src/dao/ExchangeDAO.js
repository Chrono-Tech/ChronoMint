import BigNumber from 'bignumber.js'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import lhtDAO from 'dao/LHTDAO'
import TokenModel from 'models/TokenModel'
import { ExchangeABI, MultiEventsHistoryABI } from './abi'
import type ERC20DAO from './ERC20DAO'

export const TX_BUY = 'buy'
export const TX_SELL = 'sell'

export class ExchangeDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      ExchangeABI,
      at,
      MultiEventsHistoryABI
    )
  }

  // TODO @bshevchenko
  async getAssetDAO (): Promise<ERC20DAO> {
    return lhtDAO
  }

  async getBuyPrice (): Promise<BigNumber> {
    const price = await this._call('buyPrice')
    return this._c.fromWei(price)
  }

  async getSellPrice (): Promise<BigNumber> {
    const price = await this._call('sellPrice')
    return this._c.fromWei(price)
  }

  async getETHBalance (): Promise<BigNumber> {
    const balance = await this._web3Provider.getBalance(await this.getAddress())
    return this._c.fromWei(balance)
  }

  async getAssetBalance (): Promise<BigNumber> {
    const result = await this._call('assetBalance')
    return result
  }

  async getAccountAssetBalance (): Promise<BigNumber> {
    const assetDAO = await this.getAssetDAO()
    return assetDAO.getAccountBalance()
  }

  async approveSell (token: TokenModel, amount: BigNumber) {
    const assetDAO = await token.dao()
    return assetDAO.approve(this.getInitAddress(), amount)
  }

  async sell (amount: BigNumber, price: BigNumber, token: TokenModel) {
    await this.approveSell(token, amount)

    return this._tx(
      TX_SELL,
      [
        token.dao().addDecimals(amount),
        token.dao().addDecimals(price),
      ],
      {
        amount,
        price: amount.mul(price),
      })
  }

  async buy (amount: BigNumber, price: BigNumber, token: TokenModel) {
    const priceInWei = this._c.toWei(price)
    return this._tx(
      TX_BUY,
      [
        token.dao().addDecimals(amount),
        priceInWei.div(Math.pow(10, token.decimals())),
      ],
      {
        amount,
        price: amount.mul(price),
      }, priceInWei.mul(amount)
    )
  }

  subscribeOnReset () {
    this._web3Provider.onResetPermanent(() => this.handleWeb3Reset())
  }

  handleWeb3Reset () {
    if (this.contract) {
      this.contract = this._initContract()
    }
  }

  watchError (callback) {
    this._watch('Error', callback)
  }

  watchFeeUpdated (exchange, callback) {
    this._watch('ExchangeFeeUpdated', callback, { exchange })
  }

  watchPricesUpdated (exchange, callback) {
    this._watch('ExchangePricesUpdated', callback, { exchange })
  }

  watchActiveChanged (exchange, callback) {
    this._watch('ExchangeActiveChanged', callback, { exchange })
  }

  watchBuy (exchange, callback) {
    this._watch('ExchangeBuy', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.token,
        ethAmount: this._c.fromWei(tx.args.eth),
      })
    }, { exchange })
  }

  watchSell (exchange, callback) {
    this._watch('ExchangeSell', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.token,
        ethAmount: this._c.fromWei(tx.args.eth),
      })
    }, { exchange })
  }

  watchWithdrawEther (exchange, callback) {
    this._watch('ExchangeWithdrawEther', callback, { exchange })
  }

  watchWithdrawTokens (exchange, callback) {
    this._watch('ExchangeWithdrawTokens', callback, { exchange })
  }

  watchReceivedEther (exchange, callback) {
    this._watch('ExchangeReceivedEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: this._c.fromWei(tx.args.amount),
      })
    }, { exchange })
  }

  watchTransfer (exchange, callback) {
    this._watch('Transfer', callback)
  }
}

export default new ExchangeDAO()
