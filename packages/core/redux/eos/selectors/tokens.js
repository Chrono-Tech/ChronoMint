/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getEOSWallet } from './mainSelectors'

export const getEOSWalletsTokens = (walletId) => createSelector(
  [
    getEOSWallet(walletId),
  ],
  (
    wallet,
  ) => {
    return Object.keys(wallet.balances)
  },
)
