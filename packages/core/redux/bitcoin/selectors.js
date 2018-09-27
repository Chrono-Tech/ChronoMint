/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_BITCOIN } from './constants'

export const bitcoinSelector = () => (state) =>
  state.get(DUCK_BITCOIN)

export const bitcoinPendingSelector = (blockchain) => createSelector(
  bitcoinSelector(),
  (scope) => scope[blockchain].pending,
)

export const pendingEntrySelector = (address, key, blockchain) => createSelector(
  bitcoinPendingSelector(blockchain),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)
