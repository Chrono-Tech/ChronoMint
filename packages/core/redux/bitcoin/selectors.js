/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_BITCOIN } from './constants'

export const bitcoinSelector = () => (state) => state.get(DUCK_BITCOIN)

export const bitcoinPendingSelector = () => createSelector(
  bitcoinSelector(),
  (nem) => nem.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  bitcoinPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)
