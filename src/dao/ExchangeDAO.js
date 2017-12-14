import tokenService from 'services/TokenService'
import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'
import AbstractContractDAO from 'dao/AbstractContractDAO'
import TokenModel from 'models/tokens/TokenModel'
import ExchangeOrderModel from '../models/exchange/ExchangeOrderModel'
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
      MultiEventsHistoryABI,
    )
  }

  withdrawTokens (wallet, amount: BigNumber, token: TokenModel): Promise {
    const dao = tokenService.getDAO(token)
    return this._tx(
      TX_WITHDRAW_TOKENS,
      [
        wallet.address(),
        dao.addDecimals(amount, token),
      ],
      {
        recipient: wallet.address(),
        amount: new Amount(amount, token.symbol()),
      })
  }

  withdrawEth (wallet, amount: BigNumber, token: TokenModel): Promise {
    const dao = tokenService.getDAO(token)
    return this._tx(
      TX_WITHDRAW_ETH,
      [
        wallet.address(),
        dao.addDecimals(amount, token),
      ],
      {
        recipient: wallet.address(),
        amount: new Amount(amount, 'ETH'),
      })
  }

  async approveSell (token: TokenModel, amount: BigNumber) {
    const assetDAO = tokenService.getDAO(token)
    // eslint-disable-next-line
    console.log('approveSell', assetDAO)
    return assetDAO.approve(this.getInitAddress(), amount)
  }

  sell (amount: BigNumber, exchange: ExchangeOrderModel, token: TokenModel) {
    const priceInWei = this._c.toWei(exchange.buyPrice())
    const price = priceInWei.div(Math.pow(10, token.decimals()))

    return this._tx(
      TX_SELL,
      [
        token.dao().addDecimals(amount),
        price.mul(Math.pow(10, price.decimalPlaces())),
        price.decimalPlaces(),
      ],
      {
        amount: new Amount(amount, exchange.symbol()),
        price: new Amount(amount.mul(exchange.buyPrice()), 'ETH'),
      })
  }

  buy (amount: BigNumber, exchange: ExchangeOrderModel, token: TokenModel) {
    const priceInWei = this._c.toWei(exchange.sellPrice())
    const price = priceInWei.div(Math.pow(10, token.decimals()))
    const dao = tokenService.getDAO(token)
    return this._tx(
      TX_BUY,
      [
        dao.addDecimals(amount, token),
        price.mul(Math.pow(10, price.decimalPlaces())),
        price.decimalPlaces(),
      ],
      {
        amount: new Amount(amount, exchange.symbol()),
        price: new Amount(amount.mul(exchange.sellPrice()), 'ETH'),
      }, priceInWei.mul(amount),
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
    return this._watch('Error', callback)
  }

  watchFeeUpdated (exchange, callback) {
    return this._watch('ExchangeFeeUpdated', callback, { exchange })
  }

  watchPricesUpdated (exchange, callback) {
    return this._watch('ExchangePricesUpdated', callback, { exchange })
  }

  watchActiveChanged (exchange, callback) {
    return this._watch('ExchangeActiveChanged', callback, { exchange })
  }

  watchBuy (exchange, callback) {
    return this._watch('ExchangeBuy', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.token,
        ethAmount: this._c.fromWei(tx.args.eth),
      })
    }, { exchange })
  }

  watchSell (exchange, callback) {
    return this._watch('ExchangeSell', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.token,
        ethAmount: this._c.fromWei(tx.args.eth),
      })
    }, { exchange })
  }

  watchWithdrawEther (exchange, callback) {
    return this._watch('ExchangeWithdrawEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: this._c.fromWei(tx.args.amount),
      })
    }, { exchange })
  }

  watchWithdrawTokens (exchange, callback) {
    return this._watch('ExchangeWithdrawTokens', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.amount,
      })
    }, { exchange })
  }

  watchReceivedEther (exchange, callback) {
    return this._watch('ExchangeReceivedEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: this._c.fromWei(tx.args.amount),
      })
    }, { exchange })
  }
}

export default new ExchangeDAO()
