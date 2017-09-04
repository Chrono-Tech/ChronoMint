import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import { TXS_PER_PAGE } from 'dao/AbstractTokenDAO'
import * as a from './actions'

const initialState = {
  tokensFetching: true,
  tokensFetched: false,
  tokens: new Immutable.Map(), /** @see TokenModel */
  transactions: {
    list: new Immutable.Map(),
    isFetching: false,
    endOfList: false
  },
  timeDeposit: new BigNumber(0),
  timeAddress: '',
  isTIMERequired: true,
  wallets: [],
  isMultisig: false
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
        tokensFetching: false,
        tokensFetched: true,
      }
    case a.WALLET_BALANCE:
      return {
        ...state,
        tokens: state.tokens.set(
          action.token.id(),
          state.tokens.get(action.token.id()).updateBalance(action.isCredited, action.amount)
        )
      }
    case a.WALLET_ALLOWANCE:
      return {
        ...state,
        tokens: state.tokens.set(
          action.token.id(),
          state.tokens.get(action.token.id()).setAllowance(action.spender, action.value)
        )
      }
    case a.WALLET_TIME_DEPOSIT:
      return {
        ...state,
        timeDeposit: state.timeDeposit !== null && action.isCredited !== null  ?
          state.timeDeposit[action.isCredited ? 'plus' : 'minus'](action.amount) :
          action.amount
      }
    case a.WALLET_TIME_ADDRESS:
      return {
        ...state,
        timeAddress: action.address
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
          endOfList: action.map.size < TXS_PER_PAGE
        }
      }
    case a.WALLET_IS_TIME_REQUIRED:
      return {
        ...state,
        isTIMERequired: action.value
      }
    case a.WALLET_MULTISIG_WALLETS:
      return {
        ...state,
        wallets: action.wallets
      }
    case a.WALLET_MULTISIG_TURN:
      return {
        ...state,
        isMultisig: action.isMultisig
      }
    case a.WALLET_EDIT_MULTISIG_TURN:
      return {
        ...state,
        isEditMultisig: action.isEditMultisig
      }
    case a.WALLET_ADD_NOT_EDIT_TURN:
      return {
        ...state,
        isAddNotEdit: action.isAddNotEdit
      }
    default:
      return state
  }
}
