// TODO @bshevchenko: this is intermediate version for demo
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { ETH, LHT } from 'redux/wallet/actions'
import ExchangeOrderModel from 'models/ExchangeOrderModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ethereumDAO from 'dao/EthereumDAO'

export const EXCHANGE_ORDERS = 'exchange/ORDERS'

export const search = (symbol: string, isBuy: boolean) => async (dispatch) => {

  const exchangeDAO = await contractsManagerDAO.getDemoExchange()

  const isSell = !isBuy

  let source = {symbol, isBuy}
  let limitPromise
  let accountBalancePromise

  if ((symbol === ETH && isBuy) || (symbol === LHT && isSell)) {
    symbol = ETH
    limitPromise = exchangeDAO.getETHBalance()
    accountBalancePromise = exchangeDAO.getAccountAssetBalance()
  }
  else if ((symbol === ETH && isSell) || (symbol === LHT && isBuy)) {
    symbol = LHT
    limitPromise = exchangeDAO.getAssetBalance()
    accountBalancePromise = ethereumDAO.getAccountBalance()
  }

  const [limit, buyPrice, sellPrice, accountBalance] = await Promise.all([
    limitPromise,
    exchangeDAO.getBuyPrice(),
    exchangeDAO.getSellPrice(),
    accountBalancePromise
  ])

  const order = new ExchangeOrderModel({
    limit,
    description: 'Auto Exchanger',
    symbol,
    isBuy,
    buyPrice,
    sellPrice,
    accountBalance,
    source
  })

  dispatch({type: EXCHANGE_ORDERS, orders: new Immutable.List([order])})
}

export const exchange = (order: ExchangeOrderModel, amount: BigNumber) => async (dispatch) => {

  const dao = await contractsManagerDAO.getDemoExchange()

  try {
    if (order.isBuyMain()) {
      await dao.buy(amount, order.sellPrice())
    } else {
      await dao.sell(amount, order.buyPrice())
    }
    dispatch(search(order.symbol(), order.isBuy()))
  } catch (e) {
    // no rollback
  }

}
