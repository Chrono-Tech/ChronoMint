/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_ETHEREUM } from './constants'

export const ethereumSelector = () => (state) =>
  state.get(DUCK_ETHEREUM)

export const web3Selector = () => createSelector(
  ethereumSelector(),
  (ethereum) => {
    return ethereum == null // nil check
      ? null
      : ethereum.web3.value
  },
)

export const ethereumPendingSelector = () => createSelector(
  ethereumSelector(),
  (ethereum) => ethereum == null // nil check
    ? null
    : ethereum.pending,
)

export const ethereumPendingFormatSelector = () => createSelector(
  ethereumSelector(),
  (ethereum) => {
    if (ethereum == null || ethereum.pending == null) {
      return null
    }

    return Object.values(ethereum.pending)
      .reduce((accumulator, txList) => {
        return accumulator.concat(Object.values(txList)
          .filter((tx) => tx.isAccepted && !tx.isMined))
      }, [])
  },
)

export const ethereumPendingCountSelector = () => createSelector(
  ethereumPendingFormatSelector(),
  (pendingList) => {
    return pendingList ? pendingList.length : 0
  },
)

export const pendingEntrySelector = (address, key) => createSelector(
  ethereumPendingSelector(),
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
