import ExchangeModel from 'models/exchange/ExchangeModel'

import * as a from './actions'

const initialState = new ExchangeModel()

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case a.EXCHANGE_ORDERS:
      return state.orders(action.orders)
    default:
      return state
  }
}

export default reducer
