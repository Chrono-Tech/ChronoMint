import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  orders: new Immutable.List()
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case a.EXCHANGE_ORDERS:
      return {
        ...state,
        orders: action.orders
      }
    default:
      return state
  }
}

export default reducer
