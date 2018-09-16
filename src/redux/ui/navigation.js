/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  goBack,
  push,
} from 'connected-react-router/immutable'

/*
 * Thunk dispatched by any screen.
 * Going back from anywhere
 */
export const navigateBack = () => (dispatch) => {
  dispatch(goBack())
}

export const navigateToWallets = () => (dispatch) =>
  dispatch(push('/wallets'))

export const navigateTo2Fa = () => (dispatch) =>
  dispatch(push('/2fa'))

export const navigateToRoot = () => (dispatch) =>
  dispatch(push('/'))

export const navigateToVoting = () => (dispatch) =>
  dispatch(push('/voting'))

export const navigateToAddWallet = () => (dispatch) =>
  dispatch(push('/add-wallet'))

export const navigateToNewPoll = () => (dispatch) =>
  dispatch(push('/new-poll'))

export const navigateToPoll = () => (dispatch) =>
  dispatch(push('/poll'))
