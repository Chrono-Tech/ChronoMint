/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { destroyNetworkSession, login, logout } from '@chronobank/core/redux/session/thunks'
import { change, formValueSelector } from 'redux-form/immutable'
import { navigateToVoting, navigateToRoot, navigateToWallets, navigateToPoll, navigateBack } from 'redux/ui/navigation'
import { removeWatchersUserMonitor } from '@chronobank/login-ui/redux/thunks'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import * as VotingThunks from '@chronobank/core/redux/voting/thunks'
import { removeWallet } from '@chronobank/core/redux/multisigWallet/actions'
import { replace } from 'connected-react-router/immutable'
import localStorage from 'utils/LocalStorage'
import type MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import type PollDetailsModel from '@chronobank/core/models/PollDetailsModel'
import {
  FORM_ADD_NEW_WALLET,
} from '@chronobank/core/redux/mainWallet/constants'

const destroyNetworkSessionInLocalStorage = (isReset = true) => (dispatch) => {
  dispatch(destroyNetworkSession(isReset))
  localStorage.setLastURL(`${window.location.pathname}${window.location.search}`)
  localStorage.destroySession()
}

export const removePollAndNavigateToVotings = (pollObject: PTPoll) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(VotingThunks.removePoll(pollObject))
}

export const createPollAndNavigateToVotings = (poll: PollDetailsModel) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(VotingThunks.createPoll(poll))
}

export const logoutAndNavigateToRoot = () => async (dispatch) => {
  try {
    dispatch(removeWatchersUserMonitor())
    dispatch(logout())
    dispatch(destroyNetworkSessionInLocalStorage())
    dispatch(navigateToRoot())
  } catch (e) {
    // eslint-disable-next-line
    console.error('logout error:', e)
  }
}

export const removeWalletAndNavigateToWallets = (wallet: MultisigEthWalletModel) => (dispatch) => {
  dispatch(navigateToWallets())
  dispatch(removeWallet(wallet))
}

export const loginAndSetLocalStorage = (account) => async (dispatch) => {
  const defaultURL = await dispatch(login(account))
  dispatch(replace(localStorage.getLastURL() || defaultURL))
}

export const goBackForAddWalletsForm = () => (dispatch, getState) => {
  const selector = formValueSelector(FORM_ADD_NEW_WALLET)
  const state = getState()
  const blockchain = selector(state, 'blockchain')
  const ethWalletType = selector(state, 'ethWalletType')

  if (ethWalletType) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
    return
  }

  if (blockchain) {
    dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
    return
  }
  dispatch(navigateBack())
}

export const resetWalletsForm = () => (dispatch) => {
  dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
  dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
}

export const selectPoll = (id) => (dispatch) => {
  dispatch(VotingThunks.selectPoll(id))
  dispatch(navigateToPoll())
}
