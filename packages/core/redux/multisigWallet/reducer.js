/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { REHYDRATE } from 'redux-persist'
import MultisigWalletCollection from '../../models/wallet/MultisigWalletCollection'
import * as a from './constants'

const initialState = new MultisigWalletCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload.multisigWallet
      if (incoming && incoming instanceof MultisigWalletCollection) return incoming.twoFAConfirmed(null).isInited(false)
      return state
    }
    case a.ETH_MULTISIG_INIT:
      return state.isInited(action.isInited)
    case a.ETH_MULTISIG_FETCHING:
      return state.leftToFetch(action.count)
    case a.ETH_MULTISIG_FETCHED:
      return state.itemFetched(action.wallet)
    case a.ETH_MULTISIG_UPDATE:
      return state.update(action.wallet)
    case a.ETH_MULTISIG_SELECT:
      return state.selected(action.id)
    case a.ETH_MULTISIG_REMOVE:
      return state.remove(action.id)
    case a.ETH_MULTISIG_BALANCE:
      return state.balance(action.walletId, action.balance)
    case a.ETH_MULTISIG_PENDING_TX:
      return state.pending(action.walletId, action.pending)
    case a.ETH_MULTISIG_2_FA_CONFIRMED:
      return state.twoFAConfirmed(action.twoFAConfirmed)
    default:
      return state
  }
}
