import BigNumber from 'bignumber.js'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import exchangeDAO from 'dao/ExchangeDAO'
// TODO @bshevchenko: this is intermediate version for demo
import Immutable from 'immutable'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import exchangeService from 'services/ExchangeService'

export const DUCK_EXCHANGE = 'exchange'

export const EXCHANGE_GET_ORDERS_START = 'exchange/GET_ORDERS_START'
export const EXCHANGE_GET_ORDERS_FINISH = 'exchange/GET_ORDERS_FINISH'
export const EXCHANGE_GET_DATA_START = 'exchange/GET_DATA_START'
export const EXCHANGE_GET_DATA_FINISH = 'exchange/GET_DATA_FINISH'
export const EXCHANGE_GET_TOKENS_LIST_START = 'exchange/EXCHANGE_GET_TOKENS_LIST_START'
export const EXCHANGE_GET_TOKENS_LIST_FINISH = 'exchange/EXCHANGE_GET_TOKENS_LIST_FINISH'
export const EXCHANGE_SET_FILTER = 'exchange/EXCHANGE_SET_FILTER'
export const EXCHANGE_REMOVE = 'exchange/EXCHANGE_REMOVE'
export const EXCHANGE_UPDATE = 'exchange/EXCHANGE_UPDATE'
export const EXCHANGE_MIDDLEWARE_DISCONNECTED = 'exchange/EXCHANGE_MIDDLEWARE_DISCONNECTED'

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
  dispatch({ type: EXCHANGE_GET_ORDERS_START })
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const exchangesAddresses = await exchangeManagerDAO.getExchangesWithFilter(values.get('token'))
  const exchanges = await exchangeManagerDAO.getExchangeData(exchangesAddresses)
  dispatch({ type: EXCHANGE_GET_ORDERS_FINISH, exchanges })
  dispatch({ type: EXCHANGE_SET_FILTER, filter: values })
}

export const getExchange = () => async dispatch => {
  dispatch({ type: EXCHANGE_GET_DATA_START })
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  try {
    const assetSymbols = await exchangeManagerDAO.getAssetSymbols()
    dispatch({ type: EXCHANGE_GET_DATA_FINISH, payload: { assetSymbols } })
  } catch (e) {
    dispatch({ type: EXCHANGE_MIDDLEWARE_DISCONNECTED })
    const exchanges = await exchangeManagerDAO.getExchanges(0, 10)
    dispatch({ type: EXCHANGE_GET_ORDERS_FINISH, exchanges })
  }
}

export const getExchangesForSymbol = (symbol: string) => async dispatch => {
  dispatch({ type: EXCHANGE_GET_ORDERS_START })
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const exchangesAddresses = await exchangeManagerDAO.getExchangesForSymbol(symbol)
  const exchanges = await exchangeManagerDAO.getExchangeData(exchangesAddresses)
  dispatch({ type: EXCHANGE_GET_ORDERS_FINISH, exchanges })
}

const updateExchange = (exchange: ExchangeOrderModel) => (dispatch) => {
  let updatedExchange = exchange
  if (!exchange.isNew() && !!exchange.isTransactionHash()) {
    // address arrived, delete temporary hash
    dispatch({ type: EXCHANGE_REMOVE, id: exchange.id() })
    updatedExchange = exchange.transactionHash(null)
  }
  dispatch({ type: EXCHANGE_UPDATE, exchange: updatedExchange.isPending(false) })
}

export const createExchange = (exchange: ExchangeOrderModel) => async dispatch => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const txHash = await exchangeManagerDAO.createExchange(exchange)
  // dispatch(updateExchange(exchange.isPending(true).transactionHash(txHash)))
}

export const watchExchanges = () => async (dispatch) => {
  try {
    await exchangeService.subscribeToCreateExchange()
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }

  exchangeService.on('ExchangeCreated', (result) => {
    // TODO @abdulov
    // eslint-disable-next-line
    console.log('--actions#', result)
  })
}

export const getTokenList = () => async (dispatch) => {
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_START })
  const ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const tokens = await ERC20ManagerDAO.getTokensList()
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_FINISH, tokens })
}

