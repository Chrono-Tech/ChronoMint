import ExchangeModel from 'models/exchange/ExchangeModel'
import * as a from './actions'

const initialState = new ExchangeModel()

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case a.EXCHANGE_GET_ORDERS_START:
      return state.exchanges(state.exchanges().isFetched(false).isFetching(true))
    case a.EXCHANGE_GET_ORDERS_FINISH:
      return state.exchanges(action.payload.exchanges.isFetched(true).isFetching(false))
        .filter(action.payload.filter)
    case a.EXCHANGE_GET_DATA_START:
      return state.isFetched(false).isFetching(true)
    case a.EXCHANGE_GET_DATA_FINISH:
      return state
        .assetSymbols(action.payload.assetSymbols)
        .isFetched(true).isFetching(false)
    case a.EXCHANGE_GET_TOKENS_LIST_START:
      return state
        .tokens(state.tokens().isFetching(true))
    case a.EXCHANGE_GET_TOKENS_LIST_DONE:
      return state
        .tokens(action.tokens.isFetched(true).isFetching(false))
    default:
      return state
  }
}

export default reducer
