import { Map } from 'immutable'
import { currencies } from '../wallet/reducer'

export const EXCHANGE_RATES_FETCH = 'exchange/RATES_FETCH'
export const EXCHANGE_RATES = 'exchange/RATES'
export const EXCHANGE_TRANSACTIONS_FETCH = 'exchange/TRANSACTIONS_FETCH'
export const EXCHANGE_TRANSACTIONS = 'exchange/TRANSACTIONS'
export const EXCHANGE_TRANSACTION = 'exchange/TRANSACTION'
export const EXCHANGE_BALANCE_FETCH = 'exchange/BALANCE_FETCH'
export const EXCHANGE_BALANCE = 'exchange/BALANCE'

const initialState = {
  transactions: {
    isFetching: false,
    isFetched: false,
    transactions: new Map(),
    toBlock: null
  },
  eth: {
    currencyId: currencies.ETH,
    balance: null,
    isFetching: false
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
    case EXCHANGE_BALANCE_FETCH:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: true
        }
      }
    case EXCHANGE_BALANCE:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: false,
          balance: action.balance
        }
      }
    default:
      return state
  }
}

export default reducer
