/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  createSelector,
} from 'reselect'
import {
  getCurrentWallet,
} from './actions'

export const getMainWallet = (state) => {
  return state.get('mainWallet')
}

export const getMainWalletBalance = (symbol) => createSelector(
  [getMainWallet],
  (mainWallet) => mainWallet.balances().item(symbol)
)

export const getCurrentWalletBalance = (symbol) => createSelector(
  [getCurrentWallet],
  (currentWallet) => currentWallet.balances().item(symbol)
)

export const getWalletsCount = () => createSelector(
  [getCurrentWallet],
  (currentWallet) => {
    let i = 0
    currentWallet.balances().items().map((balance) => {
      if (balance.amount().gt(0)) {
        i++
      }
    })
    return i
  }
)
