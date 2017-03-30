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
          isFetching: true
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
    case SESSION_DESTROY:
      return initialState
    default:
      return state
  }
}

const setTimeBalanceStart = () => ({type: SET_TIME_BALANCE_START})
const setTimeBalanceSuccess = (payload) => ({type: SET_TIME_BALANCE_SUCCESS, payload})

const setTimeDepositSuccess = (payload) => ({type: SET_TIME_DEPOSIT_SUCCESS, payload})

const setLHTBalanceStart = () => ({type: SET_LHT_BALANCE_START})
const setLHTBalanceSuccess = (payload) => ({type: SET_LHT_BALANCE_SUCCESS, payload})

const setETHBalanceStart = () => ({type: SET_ETH_BALANCE_START})
const setETHBalanceSuccess = (payload) => ({type: SET_ETH_BALANCE_SUCCESS, payload})

const setTransactionStart = () => ({type: FETCH_TRANSACTIONS_START})
const setTransactionSuccess = (payload) => ({type: FETCH_TRANSACTIONS_SUCCESS, payload})

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
  setTransactionSuccess
}
