import ExchangeModel from 'models/exchange/ExchangeModel'
import * as a from './actions'

const initialState = new ExchangeModel()

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case a.EXCHANGE_GET_ORDERS_START:
      return state.exchanges(state.exchanges().isFetched(false).isFetching(true))
    case a.EXCHANGE_GET_ORDERS_FINISH:
      return state.exchanges(action.exchanges.isFetched(true).isFetching(false))
    case a.EXCHANGE_SET_FILTER:
      return state.filter(action.filter)
    case a.EXCHANGE_GET_DATA_START:
      return state.isFetched(false).isFetching(true)
    case a.EXCHANGE_GET_DATA_FINISH:
      return state
        .assetSymbols(action.payload.assetSymbols)
        .isFetched(true).isFetching(false)
    case a.EXCHANGE_MIDDLEWARE_DISCONNECTED:
      return state
        .showFilter(false)
        .isFetched(true).isFetching(false)
    case a.EXCHANGE_GET_TOKENS_LIST_START:
      return state
        .tokens(state.tokens().isFetching(true))
    case a.EXCHANGE_GET_TOKENS_LIST_FINISH:
      return state
        .tokens(action.tokens.isFetched(true).isFetching(false))
    case a.EXCHANGE_REMOVE:
      return state.exchanges(state.exchanges().remove(action.exchange))
    case a.EXCHANGE_UPDATE:
      return state.exchanges(state.exchanges().update(action.exchange))
    default:
      return state
  }
}

export default reducer
