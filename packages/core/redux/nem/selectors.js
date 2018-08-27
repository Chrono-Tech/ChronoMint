/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NEM } from './constants'

export const nemSelector = () => (state) => state.get(DUCK_NEM)

export const nemPendingSelector = () => createSelector(
  nemSelector(),
  (nem) => nem.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  nemPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)
