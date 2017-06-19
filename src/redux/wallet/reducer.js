import { Map } from 'immutable'
import * as a from './actions'

const initialState = {
  tokensFetching: true,
  tokens: new Map(), /** @see TokenModel */
  transactions: {
    list: new Map(),
    isFetching: false,
    endOfList: false
  },
  timeDeposit: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLET_TOKENS_FETCH:
      return {
        ...state,
        tokensFetching: true
      }
    case a.WALLET_TOKENS:
      return {
        ...state,
        tokens: action.tokens,
        tokensFetching: false
      }
    case a.WALLET_BALANCE_FETCH:
      return {
        ...state,
        tokens: state.tokens.set(action.symbol, state.tokens.get(action.symbol).toggleFetching())
      }
    case a.WALLET_BALANCE:
      return {
        ...state,
        tokens: state.tokens.set(
          action.symbol,
          state.tokens.get(action.symbol).set('balance', action.balance).notFetching()
        )
      }
    case a.WALLET_TIME_DEPOSIT:
      return {
        ...state,
        timeDeposit: action.deposit
      }
    case a.WALLET_TRANSACTIONS_FETCH:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          isFetching: true
        }
      }
    case a.WALLET_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          list: state.transactions.list.set(action.tx.id(), action.tx)
        }
      }
    case a.WALLET_TRANSACTIONS:
      return {
        ...state,
        transactions: {
          isFetching: false,
          list: state.transactions.list.merge(action.map),
          endOfList: action.map.size === 0
        }
      }
    default:
      return state
  }
}
