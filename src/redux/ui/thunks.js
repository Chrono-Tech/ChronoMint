/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { destroyNetworkSession, login } from '@chronobank/core/redux/session/thunks'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { logout } from '@chronobank/core/redux/session/actions'
import { change, formValueSelector } from 'redux-form/immutable'
import { history } from 'redux/configureStore'
import { navigateToVoting, navigateToRoot, navigateToWallets, navigateToPoll } from 'redux/ui/navigation'
import { NETWORK_MAIN_ID } from '@chronobank/login/network/settings'
import { PTPoll } from '@chronobank/core/redux/voting/types'
import * as VotingThunks from '@chronobank/core/redux/voting/thunks'
import { removeWallet } from '@chronobank/core/redux/multisigWallet/actions'
import { replace } from 'react-router-redux'
import LocalStorage from 'utils/LocalStorage'
import type MultisigEthWalletModel from '@chronobank/core/models/wallet/MultisigEthWalletModel'
import type PollDetailsModel from '@chronobank/core/models/PollDetailsModel'
import {
  FORM_ADD_NEW_WALLET,
} from '@chronobank/core/redux/mainWallet/constants'

const destroyNetworkSessionInLocalStorage = (isReset = true) => (dispatch) => {
  dispatch(destroyNetworkSession(isReset))
  LocalStorage.setLastURL(`${window.location.pathname}${window.location.search}`)
  LocalStorage.destroySession()
}

export const removePollAndNavigateToVotings = (pollObject: PTPoll) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(VotingThunks.removePoll(pollObject))
}

export const createPollAndNavigateToVotings = (poll: PollDetailsModel) => (dispatch) => {
  dispatch(navigateToVoting())
  dispatch(VotingThunks.createPoll(poll))
}

export const logoutAndGoToRoot = () => async (dispatch, getState) => {
  try {
    const state = getState()
    const { selectedNetworkId } =state.get(DUCK_NETWORK)
    dispatch(logout())
    dispatch(destroyNetworkSessionInLocalStorage())

    if (selectedNetworkId === NETWORK_MAIN_ID) {
      location.reload()
    }
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
  dispatch(replace(LocalStorage.getLastURL() || defaultURL))
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
  history.goBack()
}

export const resetWalletsForm = () => (dispatch) => {
  dispatch(change(FORM_ADD_NEW_WALLET, 'blockchain', null))
  dispatch(change(FORM_ADD_NEW_WALLET, 'ethWalletType', null))
}

export const selectPoll = (id) => (dispatch) => {
  dispatch(VotingThunks.selectPoll(id))
  dispatch(navigateToPoll())
}
