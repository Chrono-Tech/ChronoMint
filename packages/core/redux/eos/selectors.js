/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_EOS } from './constants'

export const eosDuckSelector = (state) => state.get(DUCK_EOS)

export const eosSelector = (state) => {
  const duck = eosDuckSelector(state)
  return duck.eos
}

export const eosPendingSelector = () => createSelector(
  eosDuckSelector,
  (eos) => eos.pending,
)

export const eosPendingEntrySelector = (address, key) => createSelector(
  eosPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getEosWallets = createSelector(
  eosDuckSelector,
  (eosState) => {
    return eosState.wallets
  },
)

export const getEosWallet = (id) => createSelector(
  eosDuckSelector,
  (eosState) => {
    return eosState.wallets[id]
  },
)
