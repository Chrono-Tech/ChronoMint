/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_NAME } from './constants'

const mainScopeSelector = () => (state) => state.get(DUCK_NAME)

const blockchainScopeSelector = (blockchain) => createSelector(
  mainScopeSelector(),
  (scope) => scope[blockchain],
)

export const pendingSelector = (blockchain) => createSelector(
  blockchainScopeSelector(blockchain),
  (blockchainScope) => blockchainScope.pending,
)

export const pendingEntrySelector = (blockchain) => (address, key) => createSelector(
  pendingSelector(blockchain),
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

export const pendingTransactionsSelector = () => createSelector(
  mainScopeSelector(),
  (scope) => {
    let pendingTransactions = []

    Object.values(scope).map((blockchainScope) => {
      if (blockchainScope == null || blockchainScope.pending == null) {
        return null
      }

      pendingTransactions = pendingTransactions.concat(Object.values(blockchainScope.pending)
        .reduce((accumulator, txList) => {
          return accumulator.concat(Object.values(txList)
            .filter((tx) => tx.isAccepted && !tx.isMined && !tx.isErrored))
        }, []),
      )
    })

    return pendingTransactions
  },
)

export const pendingTransactionsNumberSelector = () => createSelector(
  pendingTransactionsSelector(),
  (pendingList) => {
    return pendingList ? pendingList.length : 0
  },
)
