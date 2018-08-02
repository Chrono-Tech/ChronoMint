/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { getWalletTransactions } from './models'
import { getEthMultisigWalletTransactions } from '../../multisigWallet/selectors/models'

export const getTxListForWallet = (walletId: string) => createSelector(
  [
    getWalletTransactions(walletId),
    getEthMultisigWalletTransactions(walletId),
  ],
  (
    walletTransactions,
    ethMultisigWalletTransactions,
  ) => {
    return Object.values(walletTransactions || ethMultisigWalletTransactions || {})
  },
)
