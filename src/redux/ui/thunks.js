/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { navigateToVoting, navigateToRoot, navigateToWallets } from 'redux/ui/navigation'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import { removePoll, createPoll } from '@chronobank/core/redux/voting/thunks'
import type PollDetailsModel from '@chronobank/core/models/PollDetailsModel'
import { logout } from '@chronobank/core/redux/session/actions'
import { removeWallet } from '@chronobank/core/redux/multisigWallet/actions'
import type MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'

export const removePollAndNavigateToVotings = (pollObject: PTPoll) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(removePoll(pollObject))
}

export const createPollAndNavigateToVotings = (poll: PollDetailsModel) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(createPoll(poll))
}

export const logoutAndGoToRoot = () => (dispatch) => {
  dispatch(logout())
  dispatch(navigateToRoot())
}

export const removeWalletAndNavigateToWallets = (wallet: MultisigEthWalletModel) => (dispatch) => {
  dispatch(navigateToWallets())
  dispatch(removeWallet(wallet))
}
