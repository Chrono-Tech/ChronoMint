/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_EOS } from './constants'

export const eosSelector = () => (state) => state.get(DUCK_EOS)

export const eosPendingSelector = () => createSelector(
  eosSelector(),
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
  eosSelector(),
  (eosState) => {
    return eosState.wallets
  },
)

export const getEosWallet = (id) => createSelector(
  eosSelector(),
  (eosState) => {
    return eosState.wallets[id]
  },
)
