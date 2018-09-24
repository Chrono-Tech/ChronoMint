/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_EOS } from '../constants'

export const EOSDuckSelector = (state) => state.get(DUCK_EOS)

export const EOSSelector = (state) => {
  const duck = EOSDuckSelector(state)
  return duck.eos
}

export const EOSPendingSelector = () => createSelector(
  EOSDuckSelector,
  (eos) => eos.pending,
)

export const eosPendingEntrySelector = (address, key) => createSelector(
  EOSPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getEosWallets = createSelector(
  EOSDuckSelector,
  (eosState) => {
    return eosState.wallets
  },
)

export const getEOSWallet = (id) => createSelector(
  EOSDuckSelector,
  (eosState) => {
    return eosState.wallets[id]
  },
)
