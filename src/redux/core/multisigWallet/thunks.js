/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as CoreMultisigWalletThunks from '@chronobank/core/redux/multisigWallet/actions'
import { navigateToWallets } from 'redux/ui/navigation'
import MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

// eslint-disable-next-line import/prefer-default-export
export const removeWallet = (wallet: MultisigEthWalletModel) => (dispatch) => {
  // TODO: it is bas idea, just remove something and navigate (or vice versa).
  // But need to think about it later, after refactoring complete.
  dispatch(navigateToWallets())
  dispatch(CoreMultisigWalletThunks.removeWallets(wallet))
}
