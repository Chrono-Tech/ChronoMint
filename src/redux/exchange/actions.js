// TODO @bshevchenko: this is intermediate version for demo
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import exchangeDAO from 'dao/ExchangeDAO'
import contractsManagerDAO from 'dao/ContractsManagerDAO'

export const EXCHANGE_GET_ORDERS_START = 'exchange/GET_ORDERS_START'
export const EXCHANGE_GET_ORDERS_FINISH = 'exchange/GET_ORDERS_FINISH'
export const EXCHANGE_GET_DATA_START = 'exchange/GET_DATA_START'
export const EXCHANGE_GET_DATA_FINISH = 'exchange/GET_DATA_FINISH'

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

export const search = (values: Immutable.Map) => async dispatch => {
  dispatch({type: EXCHANGE_GET_ORDERS_START})
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const exchangesAddresses = await exchangeManagerDAO.getExchangesWithFilter(values.get('token'))
  const exchanges = await exchangeManagerDAO.getExchangeData(exchangesAddresses)
  dispatch({type: EXCHANGE_GET_ORDERS_FINISH, payload: {exchanges, filter: values}})
}

export const getExchange = () => async dispatch => {
  dispatch({type: EXCHANGE_GET_DATA_START})
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const assetSymbols = await exchangeManagerDAO.getAssetSymbols()
  dispatch({type: EXCHANGE_GET_DATA_FINISH, payload: {assetSymbols}})
}


export const getExchangesForOwner = (owner: string) => async dispatch => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  return await exchangeManagerDAO.getExchangesForOwner(owner)
}

export const getAssetSymbols = () => async dispatch => {
  // const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  // const result = await exchangeManagerDAO.getAssetSymbols()
  // dispatch({type: EXCHANGE_GET_ORDERS_FINISH, payload: {exchanges}})
}

export const getExchangesForSymbol = (symbol: string) => async dispatch => {
  dispatch({type: EXCHANGE_GET_ORDERS_START})
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const exchangesAddresses = await exchangeManagerDAO.getExchangesForSymbol(symbol)
  const exchanges = await exchangeManagerDAO.getExchangeData(exchangesAddresses)
  dispatch({type: EXCHANGE_GET_ORDERS_FINISH, payload: {exchanges}})
}

export const getExchangeData = (exchanges: Array<string>) => async dispatch => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  return await exchangeManagerDAO.getExchangeData(exchanges)
}

export const createExchange = ({symbol, useTicker, sellPrice, buyPrice}) => async dispatch => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  exchangeManagerDAO.createExchange(symbol, useTicker, sellPrice, buyPrice)
}
export const watchExchanges = account => async (dispatch) => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  exchangeManagerDAO.watchExchanges(account, dispatch)
}
