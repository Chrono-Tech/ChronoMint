import BigNumber from 'bignumber.js'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import Immutable from 'immutable'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import exchangeService from 'services/ExchangeService'
import { DUCK_SESSION } from '../session/actions'

export const DUCK_EXCHANGE = 'exchange'

export const EXCHANGE_GET_ORDERS_START = 'exchange/GET_ORDERS_START'
export const EXCHANGE_SET_PAGES_COUNT = 'exchange/EXCHANGE_SET_PAGES_COUNT'
export const EXCHANGE_GET_ORDERS_FINISH = 'exchange/GET_ORDERS_FINISH'
export const EXCHANGE_GET_DATA_START = 'exchange/GET_DATA_START'
export const EXCHANGE_GET_DATA_FINISH = 'exchange/GET_DATA_FINISH'
export const EXCHANGE_GET_TOKENS_LIST_START = 'exchange/EXCHANGE_GET_TOKENS_LIST_START'
export const EXCHANGE_GET_TOKENS_LIST_FINISH = 'exchange/EXCHANGE_GET_TOKENS_LIST_FINISH'
export const EXCHANGE_SET_FILTER = 'exchange/EXCHANGE_SET_FILTER'
export const EXCHANGE_REMOVE = 'exchange/EXCHANGE_REMOVE'
export const EXCHANGE_UPDATE = 'exchange/EXCHANGE_UPDATE'
export const EXCHANGE_MIDDLEWARE_DISCONNECTED = 'exchange/EXCHANGE_MIDDLEWARE_DISCONNECTED'
export const EXCHANGE_EXCHANGES_LIST_GETTING_START = 'exchange/EXCHANGE_EXCHANGES_LIST_GETTING_START'
export const EXCHANGE_EXCHANGES_LIST_GETTING_FINISH = 'exchange/EXCHANGE_EXCHANGES_LIST_GETTING_FINISH'
export const EXCHANGE_GET_OWNERS_EXCHANGES_START = 'exchange/EXCHANGE_GET_OWNERS_EXCHANGES_START'
export const EXCHANGE_GET_OWNERS_EXCHANGES_FINISH = 'exchange/EXCHANGE_GET_OWNERS_EXCHANGES_FINISH'
const PAGE_SIZE = 10

export const exchange = (isBuy: boolean, amount: BigNumber, exchange: ExchangeOrderModel) => async (dispatch, getState) => {
  try {
    const exchangeDAO = await contractsManagerDAO.getExchangeDAO(exchange.address())
    const tokens = getState().get(DUCK_EXCHANGE).tokens()
    if (isBuy) {
      await exchangeDAO.buy(amount, exchange.sellPrice(), tokens.getBySymbol(exchange.symbol()))
    } else {
      await exchangeDAO.sell(amount, exchange.buyPrice(), tokens.getBySymbol(exchange.symbol()))
    }
  } catch (e) {
    // no rollback
  }
}

export const search = (values: Immutable.Map) => async (dispatch) => {
  dispatch({ type: EXCHANGE_SET_FILTER, filter: values })
  dispatch(getNextPage({
    symbol: values.get('token'),
    isBuy: values.get('filterMode').name.toLowerCase(),
  }))
}

export const getExchange = () => async (dispatch) => {
  dispatch({ type: EXCHANGE_GET_DATA_START })
  await dispatch(getTokenList())
  await dispatch(getExchangesCount())
  // not await
  dispatch(getExchangesForOwner())
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  let assetSymbols
  try {
    assetSymbols = await exchangeManagerDAO.getAssetSymbols()
  } catch (e) {
    dispatch({ type: EXCHANGE_MIDDLEWARE_DISCONNECTED })
  }
  dispatch({ type: EXCHANGE_GET_DATA_FINISH, assetSymbols })
  dispatch(getNextPage())
}

export const getExchangesForOwner = () => async (dispatch, getState) => {
  dispatch({ type: EXCHANGE_GET_OWNERS_EXCHANGES_START })
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const exchanges = await exchangeManagerDAO
    .getExchangesForOwner(getState().get(DUCK_SESSION).account, getState().get(DUCK_EXCHANGE).tokens())
  dispatch({ type: EXCHANGE_GET_OWNERS_EXCHANGES_FINISH, exchanges })
}

const getExchangesCount = () => async (dispatch) => {
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const count = await exchangeManagerDAO.getExchangesCount()
  dispatch({ type: EXCHANGE_SET_PAGES_COUNT, count })
}

export const getNextPage = (filter: Object) => async (dispatch, getState) => {
  dispatch({ type: EXCHANGE_EXCHANGES_LIST_GETTING_START })

  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const state = getState().get(DUCK_EXCHANGE)

  const exchanges = await exchangeManagerDAO.getExchanges(
    state.lastPages(),
    PAGE_SIZE,
    state.tokens(),
    filter,
    { fromMiddleWare: state.showFilter() })

  dispatch({ type: EXCHANGE_EXCHANGES_LIST_GETTING_FINISH, exchanges, lastPages: state.lastPages() + PAGE_SIZE })
}

const updateExchange = (exchange: ExchangeOrderModel) => (dispatch) => {
  let updatedExchange = exchange
  if (!exchange.isNew() && !!exchange.isTransactionHash()) {
    // address arrived, delete temporary hash
    dispatch({ type: EXCHANGE_REMOVE, exchange })
    updatedExchange = exchange.transactionHash(null).isPending(false)
  }
  dispatch({ type: EXCHANGE_UPDATE, exchange: updatedExchange })
}

export const createExchange = (exchange: ExchangeOrderModel) => async (dispatch, getState) => {
  const tokens = getState().get(DUCK_EXCHANGE).tokens()
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const txHash = await exchangeManagerDAO.createExchange(exchange, tokens.getBySymbol(exchange.symbol()))
  dispatch(updateExchange(exchange.isPending(true).transactionHash(txHash)))
}

export const watchExchanges = () => async (dispatch, getState) => {
  dispatch(getExchange())
  try {
    await exchangeService.subscribeToCreateExchange()
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }

  exchangeService.on('ExchangeCreated', async (tx) => {
    const exchangeManageDAO = await contractsManagerDAO.getExchangeManagerDAO()
    const exchangeAddress = tx.args.exchange
    const exchangeData = await exchangeManageDAO.getExchangeData([exchangeAddress], getState().get(DUCK_EXCHANGE).tokens())
    dispatch(updateExchange(exchangeData.item(exchangeAddress).transactionHash(tx.transactionHash)))
  })
}

export const getTokenList = () => async (dispatch) => {
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_START })
  const ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const tokens = await ERC20ManagerDAO.getTokensList()
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_FINISH, tokens })
}

