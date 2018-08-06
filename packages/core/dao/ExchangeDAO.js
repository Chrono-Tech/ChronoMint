/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import tokenService from '../services/TokenService'
import Amount from '../models/Amount'
import AbstractContractDAO from './AbstractContractDAO'
import TokenModel from '../models/tokens/TokenModel'
import ExchangeOrderModel from '../models/exchange/ExchangeOrderModel'
import { ExchangeABI, MultiEventsHistoryABI } from './abi'

//#region CONSTANTS

import {
  TX_BUY,
  TX_SELL,
  TX_WITHDRAW_ETH,
  TX_WITHDRAW_TOKENS,
} from './constants/ExchangeDAO'

//#endregion CONSTANTS

export class ExchangeDAO extends AbstractContractDAO {
  constructor (at = null) {
    super(
      ExchangeABI,
      at,
      MultiEventsHistoryABI,
    )
  }

  withdrawTokens (wallet, amount: Amount): Promise {
    return this._tx(
      TX_WITHDRAW_TOKENS,
      [
        wallet.address(),
        new BigNumber(amount),
      ],
      {
        recipient: wallet.address(),
        amount,
      })
  }

  withdrawEth (wallet, amount: Amount): Promise {
    return this._tx(
      TX_WITHDRAW_ETH,
      [
        wallet.address(),
        new BigNumber(amount),
      ],
      {
        recipient: wallet.address(),
        amount,
      })
  }

  async approveSell (token: TokenModel, amount: Amount) {
    const assetDAO = tokenService.getDAO(token)
    return assetDAO.approve(this.getInitAddress(), amount)
  }

  sell (amount: BigNumber, exchange: ExchangeOrderModel, token: TokenModel) {
    const amountWithDecimals = token.addDecimals(amount)
    const priceInWei = exchange.buyPrice()
    let price = this._c.fromWei(priceInWei)

    return this._tx(
      TX_SELL,
      [
        token.addDecimals(amount),
        priceInWei,
      ],
      {
        amount: new Amount(amountWithDecimals, exchange.symbol()),
        price: new Amount(this._c.toWei(amount.mul(price)), 'ETH'),
      })
  }

  buy (amount: BigNumber, exchange: ExchangeOrderModel, token: TokenModel) {
    const amountWithDecimals = token.addDecimals(amount)
    const priceInWei = exchange.sellPrice()
    let price = this._c.fromWei(priceInWei)

    return this._tx(
      TX_BUY,
      [
        token.addDecimals(amount),
        priceInWei,
      ],
      {
        amount: new Amount(amountWithDecimals, exchange.symbol()),
        price: new Amount(this._c.toWei(amount.mul(price)), 'ETH'),
      }, this._c.toWei(amount.mul(price)),
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
        ethAmount: tx.args.eth,
      })
    }, { exchange })
  }

  watchSell (exchange, callback) {
    return this._watch('ExchangeSell', (tx) => {
      callback({
        exchange: tx.args.exchange,
        tokenAmount: tx.args.token,
        ethAmount: tx.args.eth,
      })
    }, { exchange })
  }

  watchWithdrawEther (exchange, callback) {
    return this._watch('ExchangeWithdrawEther', (tx) => {
      callback({
        exchange: tx.args.exchange,
        ethAmount: tx.args.amount,
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
        ethAmount: tx.args.amount,
      })
    }, { exchange })
  }
}

export default new ExchangeDAO()
