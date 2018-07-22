/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getMainWallet } from '../../wallet/selectors/models'

export const pendingTransactionsSelector = (blockchain, address) => createSelector(
  [
    getMainWallet,
  ],
  (
    mainWallet,
  ) => {
    return mainWallet.getAllPendingTransactions(blockchain, address)
  },
)
