/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { navigateToWallets } from 'redux/ui/navigation'
import { removeWallet } from '@chronobank/core/redux/multisigWallet/actions'
import type MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

// eslint-disable-next-line import/prefer-default-export
export const removeWalletAndNavigateToWallets = (wallet: MultisigEthWalletModel) => (dispatch) => {
  dispatch(navigateToWallets())
  dispatch(removeWallet(wallet))
}
