import * as a from './actions'
import MultisigWalletCollection from 'models/Wallet/MultisigWalletCollection'

const initialState = new MultisigWalletCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.MULTISIG_FETCHING:
      return state.isFetching(true)
    case a.MULTISIG_FETCHED:
      return state
        .list(action.wallets)
        .isFetched(true)
        .isFetching(false)
    case a.MULTISIG_UPDATE:
      return state.list(state.list().set(action.wallet.id(), action.wallet))
    case a.MULTISIG_SELECT:
      return state.selected(action.address)
    case a.MULTISIG_REMOVE:
      return state.list(state.list().remove(action.wallet.id()))
    default:
      return state
  }
}
