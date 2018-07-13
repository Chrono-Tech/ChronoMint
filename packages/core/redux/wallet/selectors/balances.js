/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getWallet as getMultisigWallets } from '../../multisigWallet/selectors/models'
import { getWallet as getMainWallets } from '../../mainWallet/selectors'

export const getWalletByAddress = (address) => createSelector(
  [
    getMultisigWallets(address),
    getMainWallets,
  ],
  (
    multisigWallet,
    mainWallets,
  ) => {
    if (multisigWallet && multisigWallet.id()) {
      return multisigWallet
    } else {
      return mainWallets
    }
  },
)

