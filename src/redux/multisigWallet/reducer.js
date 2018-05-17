/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import MultisigWalletCollection from 'models/wallet/MultisigWalletCollection'
import { REHYDRATE } from 'redux-persist'
import * as a from './actions'

const initialState = new MultisigWalletCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      const incoming = action.payload.multisigWallet
      if (incoming && incoming instanceof MultisigWalletCollection) return incoming.isInited(false)
      return state
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
    case a.MULTISIG_PENDING_TX:
      return state.pending(action.walletId, action.pending)
    default:
      return state
  }
}
