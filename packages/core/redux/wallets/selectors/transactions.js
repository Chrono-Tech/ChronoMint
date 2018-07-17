/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { getWalletTransactions } from './models'

export const getTxListForWallet = (walletId: string) => createSelector(
  [
    getWalletTransactions(walletId),
  ],
  (
    walletTransactions,
  ) => {
    return Object.values(walletTransactions)
  },
)
