// TODO @bshevchenko: this is intermediate version for demo
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { ETH, LHT } from 'redux/wallet/actions'
import ExchangeOrderModel from 'models/ExchangeOrderModel'
import exchangeDAO from 'dao/ExchangeDAO'
import ethereumDAO from 'dao/EthereumDAO'

export const EXCHANGE_ORDERS = 'exchange/ORDERS'

export const search = (symbol: string, isBuy: boolean) => async dispatch => {
  const isSell = !isBuy

  let limitPromise
  let accountBalancePromise

  if ((symbol === ETH && isBuy) || (symbol === LHT && isSell)) {
    symbol = ETH
    limitPromise = exchangeDAO.getETHBalance()
    accountBalancePromise = exchangeDAO.getAccountAssetBalance()
  } else if ((symbol === ETH && isSell) || (symbol === LHT && isBuy)) {
    symbol = LHT
    limitPromise = exchangeDAO.getAssetBalance()
    accountBalancePromise = ethereumDAO.getAccountBalance()
  }

  const [limit, buyPrice, sellPrice, accountBalance] = await Promise.all([
    limitPromise,
    exchangeDAO.getBuyPrice(),
    exchangeDAO.getSellPrice(),
    accountBalancePromise,
  ])

  const order = new ExchangeOrderModel({
    limit,
    description: 'Auto Exchanger',
    symbol,
    isBuy,
    buyPrice,
    sellPrice,
    accountBalance,
  })

  dispatch({ type: EXCHANGE_ORDERS, orders: new Immutable.List([order]) })
}

export const exchange = (order: ExchangeOrderModel, amount: BigNumber) => async () => {
  try {
    if (order.isBuy()) {
      await exchangeDAO.buy(amount, order.sellPrice())
    } else {
      await exchangeDAO.sell(amount, order.buyPrice())
    }
  } catch (e) {
    // no rollback
  }
}
