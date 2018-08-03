/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

// #region imports

import {
  change,
  stopSubmit,
  SubmissionError,
} from 'redux-form'
import axios from 'axios'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import * as NetworkThunks from '@chronobank/login/redux/network/thunks'
import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import * as SessionActions from '@chronobank/core/redux/session/actions'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import networkService from '@chronobank/login/network/NetworkService'
import profileService from '@chronobank/login/network/ProfileService'
import {
  getAddress,
  createAccountEntry,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  isLocalNode,
} from '@chronobank/login/network/settings'
import * as LoginUIActions from './actions'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
  FORM_CONFIRM_MNEMONIC,
  FORM_RECOVER_ACCOUNT,
  FORM_CREATE_ACCOUNT,
  FORM_FOOTER_EMAIL_SUBSCRIPTION,
  FORM_MNEMONIC_LOGIN_PAGE,
  FORM_PRIVATE_KEY_LOGIN_PAGE,
  FORM_RESET_PASSWORD,
  FORM_WALLET_UPLOAD,
} from './constants'

// #endregion

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateAccountFromHW = (address) => (dispatch) => {
  dispatch(NetworkActions.networkSetAccounts(address))
  dispatch(LoginUIActions.navigateToCreateHWAccount())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToCreateAccount())
  dispatch(NetworkActions.networkResetImportAccountMode())
}

// #endregion

// #region perform

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to dispatch something, this is not a thunk or action. Really..
 */
export const initCommonNetworkSelector = () => (dispatch, getState) => {
  const state = getState()

  const { isLocal } = state.get(DUCK_NETWORK)

  networkService.autoSelect()

  if (!isLocal) {
    networkService.checkTestRPC()
  }

}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to dispatch something, this is not a thunk or action. Really..
 */
export const onSubmitSubscribeNewsletter = (email) => async () => {
  const publicBackendProvider = new PublicBackendProvider()

  try {
    await publicBackendProvider.getSubscribe({ email })
  } catch (e) {
    throw new SubmissionError({ _error: e && e.message })
  }
}
/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to extract logic from here
 */
export const onSubmitLoginForm = (password) => async (dispatch, getState) => {
  dispatch(NetworkActions.networkSetLoginSubmitting)

  const state = getState()
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)

  try {
    const wallet = await dispatch(PersistAccountActions.decryptAccount(selectedWallet.encrypted, password))
    dispatch(PersistAccountActions.accountLoad(wallet))
    const privateKey = wallet && wallet[0] && wallet[0].privateKey

    dispatch(SessionActions.getProfileSignature(wallet[0]))

    if (privateKey) {
      await dispatch(NetworkThunks.handleWalletLogin(selectedWallet.encrypted, password))
    }
  } catch (e) {
    throw new SubmissionError({ password: e && e.message })
  }
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to remove throws
 * TODO: to rework it
 */
export const onSubmitCreateAccountImportMnemonic = (name, password, mnemonic) =>
  async (dispatch) => {
    await dispatch(onSubmitImportAccount({
      name,
      password,
      mnemonic,
    }))

  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to remove throws
 * TODO: to rework it
 */
export const onSubmitCreateAccountImportPrivateKey = (name, password, privateKey) =>
  async (dispatch) => {
    await dispatch(onSubmitImportAccount({
      name,
      password,
      privateKey,
    }))

  }

/*
 * Thunk dispatched by
 * LoginWithMnemonic, LoginWithPrivateKey screen.
 */
export const onSubmitImportAccount = ({ name, password, mnemonic = '', privateKey = '' }) =>
  async (dispatch) => {

    try {
      let wallet = await dispatch(PersistAccountActions.createAccount({
        name,
        password,
        mnemonic,
        privateKey,
        numberOfAccounts: 0,
      }))

      dispatch(PersistAccountActions.accountAdd(wallet))
      dispatch(PersistAccountActions.accountSelect(wallet))

    } catch (e) {
      throw new SubmissionError({ _error: e && e.message })
    }

  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it
 */
export const onSubmitCreateHWAccountPage = (walletName) =>
  async (dispatch, getState) => {
    const validateName = dispatch(PersistAccountActions.validateAccountName(walletName))

    if (!validateName) {
      throw new SubmissionError({ walletName: 'Wrong wallet name' })
    }

    dispatch(NetworkActions.setAccountCredentials(walletName, walletName))

    const state = getState()
    const {
      importAccountMode,
      newAccountPrivateKey,
    } = state.get(DUCK_NETWORK)

    if (importAccountMode) {
      try {
        let wallet = await dispatch(PersistAccountActions.createHWAccount({
          name: walletName,
          pupblicKey: newAccountPrivateKey,
          numberOfAccounts: 0,
        }))

        dispatch(PersistAccountActions.accountAdd(wallet))
        dispatch(PersistAccountActions.accountSelect(wallet))
        dispatch(NetworkActions.networkResetImportAccountMode())
      } catch (e) {
        throw new SubmissionError({ _error: e && e.message })
      }
    }
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it
 */
export const onSubmitCreateHWAccountPageSuccess = () => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitCreateHWAccountPageFail = (errors, submitErrors) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to move logic to utils
*/
export const onCreateWalletFromJSON = (name, walletJSON, profile) => (dispatch) => {
  const account = createAccountEntry(name, walletJSON, profile)

  dispatch(PersistAccountActions.accountAdd(account))

}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initLoginPage = () =>
  (dispatch, getState) => {
    dispatch(NetworkThunks.resetAllLoginFlags())

    const state = getState()
    const {
      selectedWallet,
      walletsList,
    } = state.get(DUCK_PERSIST_ACCOUNT)

    if (walletsList && !walletsList.length) {
      dispatch(LoginUIActions.navigateToCreateAccount())
    }

    if (!selectedWallet) {
      dispatch(LoginUIActions.navigateToSelectWallet())
    }
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to add translation
 * TODO: to remove text from here
 * TODO: to move FORM_LOGIN_PAGE* constants from actions.js
 */
export const onSubmitResetAccountPasswordSuccess = () => (dispatch) => {
  dispatch(NetworkActions.networkResetAccountRecoveryMode())
  dispatch(LoginUIActions.navigateToLoginPage())
  dispatch(change(
    FORM_LOGIN_PAGE,
    FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
    'Your password has been reset.',
  ))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const selectProviderWithNetwork = (networkId, providerId) => (dispatch) => {
  dispatch(NetworkActions.selectProviderWithNetwork(networkId, providerId))
  if (isLocalNode(providerId, networkId)) {
    dispatch(LoginUIActions.navigateToLoginLocal())
  }
}

export const onWalletSelect = (wallet) => (dispatch, getState) => {

  dispatch(PersistAccountActions.accountSelect(wallet))

  const state = getState()
  const { accountRecoveryMode } = state.get(DUCK_NETWORK)
  if (accountRecoveryMode) {
    dispatch(LoginUIActions.navigateToRecoverAccountPage())
  }

  dispatch(LoginUIActions.navigateToLoginPage())
}

// #endregion

// #region stopSubmits

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitSubscribeNewsletterFail = (errors, submitErrors) =>
  (dispatch) => {
    dispatch(stopSubmit(FORM_FOOTER_EMAIL_SUBSCRIPTION, submitErrors && submitErrors.errors))
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitLoginFormFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_LOGIN_PAGE, submitErrors && submitErrors.errors))
  dispatch(NetworkActions.networkResetLoginSubmitting())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitLoginTestRPC = () => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitLoginTestRPCFail = (errors, submitErrors) => (dispatch) => {
  // FIXME: empty thunk
}

// #endregion
