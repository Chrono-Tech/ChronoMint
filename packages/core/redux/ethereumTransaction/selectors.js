/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_NAME } from './constants'

export const transactionSelector = () => (state) => state.get(DUCK_NAME)
export const pendingSelector = () => createSelector(transactionSelector(), pendingSubSelector)

export const pendingEntrySelector = (address, key) => (
  createSelector(pendingSelector(), getPendingEntrySubSelector(address, key))
)

const pendingSubSelector = (blockchain) => blockchain == null ? null : blockchain.pending

const getPendingEntrySubSelector = (address, key) => (
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
  }
)
