import { Map } from 'immutable'
import * as a from './actions'

export const currencies = {
  TIME: 'TIME',
  LHT: 'LHT',
  ETH: 'ETH'
}

const initialState = {
  tokensFetching: true,
  tokens: [], // of ERC20DAO
  time: {
    currencyId: currencies.TIME,
    balance: null,
    isFetching: false,
    isFetched: false,
    deposit: 0
  },
  lht: {
    currencyId: currencies.LHT,
    balance: null,
    isFetching: false,
    isFetched: false
  },
  eth: {
    currencyId: currencies.ETH,
    balance: null,
    isFetching: false,
    isFetched: false
  },
  contractsManagerLHT: {
    currencyId: currencies.LHT,
    balance: null,
    isFetching: false,
    isSubmitting: false
  },
  isFetching: false,
  isFetched: false,
  transactions: new Map(),
  toBlock: null
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
    case a.WALLET_BALANCE_TIME_FETCH:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: true
        }
      }
    case a.WALLET_BALANCE_TIME:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: false,
          isFetched: true,
          balance: action.balance !== null ? action.balance : state.time.balance
        }
      }
    case a.WALLET_TIME_DEPOSIT:
      return {
        ...state,
        time: {
          ...state.time,
          deposit: action.deposit
        }
      }
    case a.WALLET_BALANCE_LHT_FETCH:
      return {
        ...state,
        lht: {
          ...state.lht,
          isFetching: true
        }
      }
    case a.WALLET_BALANCE_LHT:
      return {
        ...state,
        lht: {
          ...state.lht,
          isFetching: false,
          isFetched: true,
          balance: action.balance
        }
      }
    case a.WALLET_BALANCE_ETH_FETCH:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: true
        }
      }
    case a.WALLET_BALANCE_ETH:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: false,
          isFetched: true,
          balance: action.balance
        }
      }
    case a.WALLET_TRANSACTIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case a.WALLET_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.set(action.tx.id(), action.tx)
      }
    case a.WALLET_TRANSACTIONS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        transactions: state.transactions.merge(action.map),
        toBlock: action.toBlock
      }
    case a.WALLET_CM_BALANCE_LHT_FETCH:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isFetching: true
        }
      }
    case a.WALLET_CM_BALANCE_LHT:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isFetching: false,
          balance: action.balance
        }
      }
    case a.WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isSubmitting: true
        }
      }
    case a.WALLET_SEND_CM_LHT_TO_EXCHANGE_END:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isSubmitting: false
        }
      }
    default:
      return state
  }
}
