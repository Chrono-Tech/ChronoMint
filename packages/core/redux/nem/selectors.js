/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NEM } from './constants'

export const nemSelector = () => (state) =>
  state.get(DUCK_NEM)

export const nemPendingSelector = () => createSelector(
  nemSelector(),
  (nem) => nem == null // nil check
    ? null
    : nem.pending,
)

export const pendingEntrySelector = (address, key) => createSelector(
  nemPendingSelector(),
  (pending) => {
    if (address in pending) {
      const res = pending[address][key] || null
      if (!res) {
        // eslint-disable-next-line
        console.log('res null', address, key, pending, new Error())
      }
      return res
    }

    // eslint-disable-next-line
    console.log('res null', address, key, pending, new Error())
    return null
  },
)
