import BigNumber from 'bignumber.js'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import TokenModel from 'models/TokenModel'
import { ExchangeABI, MultiEventsHistoryABI } from './abi'

export const TX_BUY = 'buy'
export const TX_SELL = 'sell'
export const TX_WITHDRAW_TOKENS = 'withdrawTokens'
export const TX_WITHDRAW_ETH = 'withdrawEth'

export class ExchangeDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      ExchangeABI,
      at,
      MultiEventsHistoryABI
    )
  }

  async withdrawTokens (wallet, amount: BigNumber, token: TokenModel): Promise {
    return this._tx(
      TX_WITHDRAW_TOKENS,
      [
        wallet.address(),
        token.dao().addDecimals(amount),
      ],
      {
        recipient: wallet.address(),
        amount,
      })
  }

  async withdrawEth (wallet, amount: BigNumber, token: TokenModel): Promise {
    return this._tx(
      TX_WITHDRAW_ETH,
      [
        wallet.address(),
        token.dao().addDecimals(amount),
      ],
      {
        recipient: wallet.address(),
        amount,
      })
  }

  async approveSell (token: TokenModel, amount: BigNumber) {
    const assetDAO = await token.dao()
    return assetDAO.approve(this.getInitAddress(), amount)
  }

  async sell (amount: BigNumber, price: BigNumber, token: TokenModel) {
    return this._tx(
      TX_SELL,
      [
        token.dao().addDecimals(amount),
        this._c.toWei(price).div(Math.pow(10, token.decimals())),
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
    this._watch('ExchangeWithdrawEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: this._c.fromWei(tx.args.amount),
      })
    }, { exchange })
  }

  watchWithdrawTokens (exchange, callback) {
    this._watch('ExchangeWithdrawTokens', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.amount,
      })
    }, { exchange })
  }

  watchReceivedEther (exchange, callback) {
    this._watch('ExchangeReceivedEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: this._c.fromWei(tx.args.amount),
      })
    }, { exchange })
  }
}

export default new ExchangeDAO()
