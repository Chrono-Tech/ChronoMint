/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getMainWallets } from './models'
import WalletModel from '../../../models/wallet/WalletModel'

export const getAllPendingTransactions = createSelector(
  [
    getMainWallets,
  ],
  (
    mainWallets,
  ) => {
    const pendingTransactions = {}

    mainWallets.map((wallet: WalletModel) => {
      if (wallet.transactions.blocks && wallet.transactions.blocks['-1']) {
        wallet.transactions.blocks['-1'].transactions.map((tx) => {
          pendingTransactions[tx.id] = tx
        })
      }
    })
    return Object.values(pendingTransactions)
  },
)

export const pendingTransactionsSelector = () => createSelector(
  [
    getAllPendingTransactions,
  ],
  (
    pendingTxs,
  ) => {
    return pendingTxs
  },
)
