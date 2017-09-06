import Immutable from 'immutable'
import * as a from './actions'

const initialState = {
  wallets: new Immutable.Map([]),
  isPinCodeCorrect: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.SENSITIVE_WALLET_ADD:
      return {
        ...state,
        wallets: state.wallets.set(
          action.wallet.id,
          action.wallet
        )
      }
    case a.SENSITIVE_STORED_WALLETS_LOAD:
      return {
        ...state,
        wallets: state.wallets.merge(new Immutable.Map(action.wallets))
      }
    case a.SENSITIVE_PINCODE_CHECK:
      return {
        ...state,
        wallets: state.wallets.set(action.wallet.address, action.wallet)
      }
    default:
      return state
  }
}