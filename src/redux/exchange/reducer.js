import {Map, List} from 'immutable'

export const EXCHANGE_RATES_FETCH = 'exchange/RATES_FETCH'
export const EXCHANGE_RATES = 'exchange/RATES'
export const EXCHANGE_TRANSACTIONS_FETCH = 'exchange/TRANSACTIONS_FETCH'
export const EXCHANGE_TRANSACTIONS = 'exchange/TRANSACTIONS'

const initialState = {
  transactions: {
    isFetching: false,
    isFetched: false,
    transactions: new Map(),
    toBlock: null
  },
  rates: {
    rates: new List(),
    isFetching: false,
    isFetched: false
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EXCHANGE_RATES_FETCH:
      return {
        ...state,
        rates: {
          ...state.rates,
          isFetching: true
        }
      }
    case EXCHANGE_RATES:
      return {
        ...state,
        rates: {
          ...state.rates,
          isFetching: false,
          isFetched: true,
          rates: state.rates.rates.push(action.rates)
        }
      }
    case EXCHANGE_TRANSACTIONS_FETCH:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          isFetching: true
        }
      }
    case EXCHANGE_TRANSACTIONS:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          isFetching: false,
          isFetched: true,
          transactions: state.transactions.transactions.merge(action.transactions),
          toBlock: action.toBlock
        }
      }
    default:
      return state
  }
}

export default reducer
