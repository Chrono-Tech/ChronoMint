import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  wallets: new Immutable.Map(),
  isFetching: false,
  isFetched: false,
  selected: null //address
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.MULTISIG_FETCHING:
      return {
        ...state,
        isFetching: true
      }
    case a.MULTISIG_FETCHED:
      return {
        ...state,
        isFetching: false,
        isFetched: true,
        wallets: action.wallets
      }
    case a.MULTISIG_UPDATE:
      return {
        ...state,
        wallets: state.wallets.set(action.wallet.id(), action.wallet)
      }
    case a.MULTISIG_SELECT:
      return {
        ...state,
        selected: action.address
      }
    case a.MULTISIG_REMOVE:
      return {
        ...state,
        wallets: state.wallets.remove(action.wallet.id())
      }
    default:
      return state
  }
}
