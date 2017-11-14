import * as a from './actions'

const initialState = {
  current: null, // address
  isMultisig: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.WALLET_SWITCH_WALLET:
      return {
        ...state,
        current: action.wallet.address(),
        isMultisig: action.wallet.isMultisig(),
      }
    default:
      return state
  }
}
