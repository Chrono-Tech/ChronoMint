import { Map } from 'immutable'

export const WALLET_BALANCE_TIME_FETCH = 'wallet/BALANCE_TIME_FETCH'
export const WALLET_BALANCE_TIME = 'wallet/BALANCE_TIME'
export const WALLET_TIME_DEPOSIT = 'wallet/TIME_DEPOSIT'
export const WALLET_BALANCE_LHT_FETCH = 'wallet/BALANCE_LHT_FETCH'
export const WALLET_BALANCE_LHT = 'wallet/BALANCE_LHT'
export const WALLET_BALANCE_ETH_FETCH = 'wallet/BALANCE_ETH_FETCH'
export const WALLET_BALANCE_ETH = 'wallet/BALANCE_ETH'
export const WALLET_TRANSACTIONS_FETCH = 'wallet/TRANSACTIONS_FETCH'
export const WALLET_TRANSACTION = 'wallet/TRANSACTION'
export const WALLET_TRANSACTIONS = 'wallet/TRANSACTIONS'
export const WALLET_CM_BALANCE_LHT_FETCH = 'wallet/CM_BALANCE_LHT_FETCH'
export const WALLET_CM_BALANCE_LHT = 'wallet/CM_BALANCE_LHT'
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH = 'wallet/SEND_CM_LHT_TO_EXCHANGE_FETCH' // TODO Move this two actions
export const WALLET_SEND_CM_LHT_TO_EXCHANGE_END = 'wallet/SEND_CM_LHT_TO_EXCHANGE_END' // TODO ...to LOCs duck

export const currencies = {
  TIME: 'TIME',
  LHT: 'LHT',
  ETH: 'ETH'
}

const initialState = {
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
    case WALLET_BALANCE_TIME_FETCH:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: true
        }
      }
    case WALLET_BALANCE_TIME:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: false,
          isFetched: true,
          balance: action.balance !== null ? action.balance : state.time.balance
        }
      }
    case WALLET_TIME_DEPOSIT:
      return {
        ...state,
        time: {
          ...state.time,
          deposit: action.deposit
        }
      }
    case WALLET_BALANCE_LHT_FETCH:
      return {
        ...state,
        lht: {
          ...state.lht,
          isFetching: true
        }
      }
    case WALLET_BALANCE_LHT:
      return {
        ...state,
        lht: {
          ...state.lht,
          isFetching: false,
          isFetched: true,
          balance: action.balance
        }
      }
    case WALLET_BALANCE_ETH_FETCH:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: true
        }
      }
    case WALLET_BALANCE_ETH:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: false,
          isFetched: true,
          balance: action.balance
        }
      }
    case WALLET_TRANSACTIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case WALLET_TRANSACTION:
      return {
        ...state,
        transactions: state.transactions.set(action.tx.id(), action.tx)
      }
    case WALLET_TRANSACTIONS:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        transactions: state.transactions.merge(action.map),
        toBlock: action.toBlock
      }
    case WALLET_CM_BALANCE_LHT_FETCH:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isFetching: true
        }
      }
    case WALLET_CM_BALANCE_LHT:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isFetching: false,
          balance: action.balance
        }
      }
    case WALLET_SEND_CM_LHT_TO_EXCHANGE_FETCH:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isSubmitting: true
        }
      }
    case WALLET_SEND_CM_LHT_TO_EXCHANGE_END:
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
