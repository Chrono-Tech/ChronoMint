import BigNumber from 'bignumber.js'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import Immutable from 'immutable'
import ExchangeOrderModel from 'models/exchange/ExchangeOrderModel'
import { DUCK_SESSION } from 'redux/session/actions'
import exchangeService from 'services/ExchangeService'
import { DUCK_MAIN_WALLET, WALLET_ALLOWANCE } from 'redux/mainWallet/actions'
import TokenModel from 'models/tokens/TokenModel'

export const DUCK_EXCHANGE = 'exchange'

export const EXCHANGE_INIT = 'exchange/INIT'
export const EXCHANGE_GET_ORDERS_START = 'exchange/GET_ORDERS_START'
export const EXCHANGE_SET_PAGES_COUNT = 'exchange/EXCHANGE_SET_PAGES_COUNT'
export const EXCHANGE_GET_ORDERS_FINISH = 'exchange/GET_ORDERS_FINISH'
export const EXCHANGE_GET_DATA_START = 'exchange/GET_DATA_START'
export const EXCHANGE_GET_DATA_FINISH = 'exchange/GET_DATA_FINISH'
export const EXCHANGE_GET_TOKENS_LIST_START = 'exchange/EXCHANGE_GET_TOKENS_LIST_START'
export const EXCHANGE_GET_TOKENS_LIST_FINISH = 'exchange/EXCHANGE_GET_TOKENS_LIST_FINISH'
export const EXCHANGE_SET_FILTER = 'exchange/EXCHANGE_SET_FILTER'
export const EXCHANGE_REMOVE_FOR_OWNER = 'exchange/EXCHANGE_REMOVE_FOR_OWNER'
export const EXCHANGE_UPDATE = 'exchange/EXCHANGE_UPDATE'
export const EXCHANGE_UPDATE_FOR_OWNER = 'exchange/EXCHANGE_UPDATE_FOR_OWNER'
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
      await exchangeDAO.buy(amount, exchange, tokens.getBySymbol(exchange.symbol()))
    } else {
      await exchangeDAO.sell(amount, exchange, getState().get(DUCK_MAIN_WALLET).tokens().get(exchange.symbol()))
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

export const getTokensAllowance = (exchange: ExchangeOrderModel) => async (dispatch, getState) => {
  const token = getState().get(DUCK_EXCHANGE).tokens().getBySymbol(exchange.symbol())
  const allowance = await token.dao().getAccountAllowance(exchange.address())
  dispatch({ type: WALLET_ALLOWANCE, token, value: allowance, spender: exchange.address() })
}

export const approveTokensForExchange = (exchange: ExchangeOrderModel, token: TokenModel, amount: BigNumber) => async () => {
  const dao = await contractsManagerDAO.getExchangeDAO(exchange.address())
  await dao.approveSell(token, amount)
}

export const getExchangesCount = () => async (dispatch) => {
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
    {
      fromMiddleWare: state.showFilter(),
    })

  dispatch({ type: EXCHANGE_EXCHANGES_LIST_GETTING_FINISH, exchanges, lastPages: state.lastPages() + exchanges.size() })
}

export const updateExchange = (exchange: ExchangeOrderModel) => (dispatch, getState) => {
  const state = getState().get(DUCK_EXCHANGE)

  state.exchangesForOwner().item(exchange.id()) && dispatch({ type: EXCHANGE_UPDATE_FOR_OWNER, exchange })

  state.exchanges().item(exchange.id()) && dispatch({ type: EXCHANGE_UPDATE, exchange })
}

export const createExchange = (exchange: ExchangeOrderModel) => async (dispatch, getState) => {
  const tokens = getState().get(DUCK_EXCHANGE).tokens()
  const exchangeManagerDAO = await contractsManagerDAO.getExchangeManagerDAO()
  const txHash = await exchangeManagerDAO.createExchange(exchange, tokens.getBySymbol(exchange.symbol()))
  dispatch({ type: EXCHANGE_UPDATE_FOR_OWNER, exchange: exchange.isPending(true).transactionHash(txHash) })
}

export const withdrawFromExchange = (exchange: ExchangeOrderModel, wallet, amount: string, symbol: string) => async () => {
  const exchangeDAO = await contractsManagerDAO.getExchangeDAO(exchange.address())
  const token = wallet.tokens().get(symbol)
  if (symbol.toLowerCase() === 'eth') {
    await exchangeDAO.withdrawEth(wallet, new BigNumber(amount), token)
  } else {
    await exchangeDAO.withdrawTokens(wallet, new BigNumber(amount), token)
  }
}

export const getExchangeFromState = (state: Object, address: string) => {
  return state.exchanges().item(address) || state.exchangesForOwner().item(address)
}

export const watchExchanges = () => async (dispatch, getState) => {
  if (getState().get(DUCK_EXCHANGE).isInited()) {
    return
  }
  dispatch({ type: EXCHANGE_INIT, isInited: true })

  dispatch(getExchange())
  const account = getState().get(DUCK_SESSION).account
  try {
    await exchangeService.subscribeToCreateExchange(account)
  } catch (e) {
    // eslint-disable-next-line
    console.error('watch error', e.message)
  }

  exchangeService.on('ExchangeCreated', async (tx) => {
    if (account === tx.args.user) {
      const exchangeManageDAO = await contractsManagerDAO.getExchangeManagerDAO()
      const exchangeAddress = tx.args.exchange
      const exchangeData = await exchangeManageDAO.getExchangeData([ exchangeAddress ], getState().get(DUCK_EXCHANGE).tokens())
      const exchange = exchangeData.item(exchangeAddress)
      dispatch({
        type: EXCHANGE_REMOVE_FOR_OWNER,
        exchange: exchange.transactionHash(tx.transactionHash),
      })
      dispatch({ type: EXCHANGE_UPDATE_FOR_OWNER, exchange })
    }
    dispatch(getExchangesCount())
  })
  exchangeService.on('Error', async (/*tx*/) => {
    // eslint-disable-next-line
    // console.error('event error', tx)
  })

  exchangeService.on('FeeUpdated', async (/*tx*/) => {
    // eslint-disable-next-line
    // console.log('--actions#FeeUpdated', tx)
  })

  exchangeService.on('PricesUpdated', async (/*tx*/) => {
    // eslint-disable-next-line
    // console.log('--actions#PricesUpdated', tx)
  })

  exchangeService.on('ActiveChanged', async (/*tx*/) => {
    // eslint-disable-next-line
    // console.log('--actions#ActiveChanged', tx)
  })

  exchangeService.on('Buy', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.exchange)
    const token = state.tokens().getBySymbol(exchange.symbol())
    dispatch(updateExchange(exchange
      .assetBalance(exchange.assetBalance().minus(token.dao().removeDecimals(tx.tokenAmount)))
      .ethBalance(exchange.ethBalance().plus(tx.ethAmount)),
    ))
  })

  exchangeService.on('Sell', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.exchange)
    dispatch(updateExchange(exchange
      .ethBalance(exchange.ethBalance().minus(tx.ethAmount)),
    ))
  })

  exchangeService.on('WithdrawEther', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.exchange)
    dispatch(updateExchange(exchange
      .ethBalance(exchange.ethBalance().minus(tx.ethAmount)),
    ))
  })

  exchangeService.on('WithdrawTokens', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.exchange)
    const token = state.tokens().getBySymbol(exchange.symbol())
    dispatch(updateExchange(exchange
      .assetBalance(exchange.assetBalance().minus(token.dao().removeDecimals(tx.tokenAmount))),
    ))
  })

  exchangeService.on('ReceivedEther', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.exchange)
    dispatch(updateExchange(exchange.ethBalance(exchange.ethBalance().plus(tx.ethAmount))))

  })

  exchangeService.on('Transfer', async (tx) => {
    const state = getState().get(DUCK_EXCHANGE)
    const exchange = getExchangeFromState(state, tx.to())
    exchange && dispatch(updateExchange(exchange.assetBalance(exchange.assetBalance().plus(tx.value()))))
  })
}

export const getTokenList = () => async (dispatch) => {
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_START })
  const ERC20ManagerDAO = await contractsManagerDAO.getERC20ManagerDAO()
  const tokens = await ERC20ManagerDAO.getTokensList()
  dispatch({ type: EXCHANGE_GET_TOKENS_LIST_FINISH, tokens })
}

