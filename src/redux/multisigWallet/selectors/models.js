/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'

export const getWallets = (state) => {
  return state.get(DUCK_MULTISIG_WALLET)
}

export const getWallet = (address) => createSelector(
  [getWallets],
  (wallets) => {
    return address ? wallets.item(address) : new MultisigWalletModel()
  },
)
