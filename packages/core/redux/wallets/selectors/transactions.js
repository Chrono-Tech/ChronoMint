/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { getWalletTransactions } from './models'
import { getEthMultisigWalletTransactions } from '../../multisigWallet/selectors/models'
import { getEOSWalletTransactions } from '../../eos/selectors/mainSelectors'
import { getWalletTransactions as getLHTWalletTransactions } from '../../laborHour/selectors/mainSelectors'

export const getTxListForWallet = (walletId: string) => createSelector(
  [
    getWalletTransactions(walletId),
    getEthMultisigWalletTransactions(walletId),
    getEOSWalletTransactions(walletId),
    getLHTWalletTransactions(walletId)
  ],
  (
    walletTransactions,
    ethMultisigWalletTransactions,
    eosWalletTransactions,
    getLHTWalletTransactions,
  ) => {
    return walletTransactions || ethMultisigWalletTransactions || eosWalletTransactions || getLHTWalletTransactions || {}
  },
)
