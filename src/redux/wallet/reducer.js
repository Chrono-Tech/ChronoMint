import {Map} from 'immutable'
import TransactionModel from '../../models/TransactionModel'

import {
  SESSION_DESTROY
} from '../session/actions'

// Constants
const SET_TIME_DEPOSIT_SUCCESS = 'wallet/SET_TIME_DEPOSIT_SUCCESS'

const SET_TIME_BALANCE_START = 'wallet/SET_TIME_BALANCE_START'
const SET_TIME_BALANCE_SUCCESS = 'wallet/SET_TIME_BALANCE_SUCCESS'

const SET_LHT_BALANCE_START = 'wallet/SET_LHT_BALANCE_START'
const SET_LHT_BALANCE_SUCCESS = 'wallet/SET_LHT_BALANCE_SUCCESS'

const SET_ETH_BALANCE_START = 'wallet/SET_ETH_BALANCE_START'
const SET_ETH_BALANCE_SUCCESS = 'wallet/SET_ETH_BALANCE_SUCCESS'

const FETCH_TRANSACTIONS_START = 'wallet/FETCH_TRANSACTIONS_START'
const FETCH_TRANSACTIONS_SUCCESS = 'wallet/FETCH_TRANSACTIONS_SUCCESS'

const SET_CONTRACTS_MANAGER_LHT_BALANCE_START = 'wallet/SET_CONTRACTS_MANAGER_LHT_BALANCE_START'
const SET_CONTRACTS_MANAGER_LHT_BALANCE_SUCCESS = 'wallet/SET_CONTRACTS_MANAGER_LHT_BALANCE_SUCCESS'

const SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_START = 'wallet/SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_START'
const SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_END = 'wallet/SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_END'

// Reducer
const initialState = {
  time: {
    balance: null,
    isFetching: true,
    deposit: 0
  },
  lht: {
    balance: null,
    isFetching: true
  },
  eth: {
    balance: null,
    isFetching: true
  },
  contractsManagerLHT: {
    balance: null,
    isFetching: true
  },
  isFetching: false,
  transactions: new Map()
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_TIME_BALANCE_START:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: action.payload
        }
      }
    case SET_TIME_BALANCE_SUCCESS:
      return {
        ...state,
        time: {
          ...state.time,
          isFetching: false,
          balance: action.payload
        }
      }
    case SET_TIME_DEPOSIT_SUCCESS:
      return {
        ...state,
        time: {
          ...state.time,
          deposit: action.payload
        }
      }
    case SET_LHT_BALANCE_START:
      return {
        ...state,
        lht: {
          ...state.lht,
          isFetching: true
        }
      }
    case SET_LHT_BALANCE_SUCCESS:
      return {
        ...state,
        lht: {
          isFetching: false,
          balance: action.payload
        }
      }
    case SET_ETH_BALANCE_START:
      return {
        ...state,
        eth: {
          ...state.eth,
          isFetching: true
        }
      }
    case SET_ETH_BALANCE_SUCCESS:
      return {
        ...state,
        eth: {
          isFetching: false,
          balance: action.payload
        }
      }
    case FETCH_TRANSACTIONS_START:
      return {
        ...state,
        isFetching: true
      }
    case FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        transactions: state.transactions.set(action.payload.txHash, new TransactionModel(action.payload))
      }
    case SET_CONTRACTS_MANAGER_LHT_BALANCE_START:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isFetching: true
        }
      }
    case SET_CONTRACTS_MANAGER_LHT_BALANCE_SUCCESS:
      return {
        ...state,
        contractsManagerLHT: {
          isFetching: false,
          balance: action.payload
        }
      }
    case SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_START:
      return {
        ...state,
        contractsManagerLHT: {
          ...state.contractsManagerLHT,
          isSubmitting: true
        }
      }
    case SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_END:
      return {
        ...state,
        contractsManagerLHT: {
          isSubmitting: false
        }
      }
    case SESSION_DESTROY:
      return initialState
    default:
      return state
  }
}

const setTimeBalanceStart = (payload = true) => ({type: SET_TIME_BALANCE_START, payload})
const setTimeBalanceSuccess = (payload) => ({type: SET_TIME_BALANCE_SUCCESS, payload})

const setTimeDepositSuccess = (payload) => ({type: SET_TIME_DEPOSIT_SUCCESS, payload})

const setLHTBalanceStart = () => ({type: SET_LHT_BALANCE_START})
const setLHTBalanceSuccess = (payload) => ({type: SET_LHT_BALANCE_SUCCESS, payload})

const setETHBalanceStart = () => ({type: SET_ETH_BALANCE_START})
const setETHBalanceSuccess = (payload) => ({type: SET_ETH_BALANCE_SUCCESS, payload})

const setTransactionStart = () => ({type: FETCH_TRANSACTIONS_START})
const setTransactionSuccess = (payload) => ({type: FETCH_TRANSACTIONS_SUCCESS, payload})

const setContractsManagerLHTBalanceStart = () => ({type: SET_CONTRACTS_MANAGER_LHT_BALANCE_START})
const setContractsManagerLHTBalanceSuccess = (payload) => ({type: SET_CONTRACTS_MANAGER_LHT_BALANCE_SUCCESS, payload})

const sendCMLHTToExchangeStart = () => ({type: SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_START})
const sendCMLHTToExchangeEnd = (payload) => ({type: SEND_CONTRACTS_MANAGER_LHT_TO_EXCHANGE_END, payload})

export default reducer

export {
  setTimeBalanceStart,
  setTimeBalanceSuccess,
  setTimeDepositSuccess,
  setLHTBalanceStart,
  setLHTBalanceSuccess,
  setETHBalanceStart,
  setETHBalanceSuccess,
  setTransactionStart,
  setTransactionSuccess,
  setContractsManagerLHTBalanceStart,
  setContractsManagerLHTBalanceSuccess,
  sendCMLHTToExchangeStart,
  sendCMLHTToExchangeEnd
}
