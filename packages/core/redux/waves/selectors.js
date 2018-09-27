/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_WAVES } from './constants'

export const wavesSelector = () => (state) => state.get(DUCK_WAVES)

export const wavesPendingSelector = () => createSelector(
  wavesSelector(),
  (waves) => waves.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  wavesPendingSelector(),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)
