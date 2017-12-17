import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'

import * as a from './actions'

const initialState = new MultisigWalletCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.MULTISIG_INIT:
      return state.isInited(action.isInited)
    case a.MULTISIG_FETCHING:
      return state.leftToFetch(action.count)
    case a.MULTISIG_FETCHED:
      return state.itemFetched(action.wallet)
    case a.MULTISIG_UPDATE:
      return state.update(action.wallet)
    case a.MULTISIG_SELECT:
      return state.selected(action.id)
    case a.MULTISIG_REMOVE:
      return state.remove(action.id)
    case a.MULTISIG_BALANCE:
      return state.balance(action.walletId, action.balance)
    default:
      return state
  }
}
