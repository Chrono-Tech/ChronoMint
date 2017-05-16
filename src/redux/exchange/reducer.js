import { Map } from 'immutable'

export const EXCHANGE_RATES_FETCH = 'exchange/RATES_FETCH'
export const EXCHANGE_RATES = 'exchange/RATES'
export const EXCHANGE_TRANSACTIONS_FETCH = 'exchange/TRANSACTIONS_FETCH'
export const EXCHANGE_TRANSACTIONS = 'exchange/TRANSACTIONS'
export const EXCHANGE_TRANSACTION = 'exchange/TRANSACTION'

const initialState = {
  transactions: {
    isFetching: false,
    isFetched: false,
    transactions: new Map(),
    toBlock: null
  },
  rates: {
    rates: new Map(),
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
          rates: state.rates.rates.set(action.rate.symbol(), action.rate)
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
    case EXCHANGE_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          transactions: state.transactions.transactions.set(action.tx.id(), action.tx)
        }
      }
    case EXCHANGE_TRANSACTIONS:
      return {
        ...state,
        transactions: {
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
