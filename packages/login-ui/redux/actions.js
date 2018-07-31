/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

// #region imports

import {
  goBack,
  push,
} from 'react-router-redux'

// #endregion

// #region names of forms

export const FORM_CONFIRM_MNEMONIC = 'ConfirmMnemonicForm'
export const FORM_CREATE_ACCOUNT = 'CreateAccountForm'
export const FORM_FOOTER_EMAIL_SUBSCRIPTION = 'FooterEmailSubscriptionForm'
export const FORM_LOGIN_PAGE = 'FormLoginPage'
export const FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE = 'LoginPageFieldSuccessMessage'
export const FORM_MNEMONIC_LOGIN_PAGE = 'FormMnemonicLoginPage'
export const FORM_NETWORK_CONFIRM_DELETE = 'FormNetworkConfirmDelete'
export const FORM_NETWORK_CREATE = 'FormNetworkCreate'
export const FORM_PRIVATE_KEY_LOGIN_PAGE = 'FormPrivateKeyLoginPage'
export const FORM_RECOVER_ACCOUNT = 'RecoverAccountPage'
export const FORM_RESET_PASSWORD = 'ResetPasswordPage'
export const FORM_WALLET_UPLOAD = 'FormWalletUploadPage'
export const FORM_ACCOUNT_NAME = 'FormAccountName'

// #endregion

// #region Navigation thunks

/*
 * Thunk dispatched by any screen.
 * Going back from anywhere
 * TODO: to check it. It is not used...
 */
export const navigateBack = () => (dispatch) => {
  dispatch(goBack())
}

/*
 * Thunk dispatched by "LoginWithOptions" screen.
 * Resetting account import mode and navigate to CreateAccount screen
 */
export const navigateToCreateAccount = () => (dispatch) => {
  dispatch(push('/login/create-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToConfirmMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/confirm-mnemonic'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToDownloadWalletPage = () => (dispatch) => {
  dispatch(push('/login/download-wallet'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateHWAccount = () => (dispatch) => {
  dispatch(push('/login/create-hw-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToSelectImportMethod = () => (dispatch) => {
  dispatch(push('/login/import-methods'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToTrezorImportMethod = () => (dispatch) => {
  dispatch(push('/login/trezor-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToLedgerImportMethod = () => (dispatch) => {
  dispatch(push('/login/ledger-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToPluginImportMethod = () => (dispatch) => {
  dispatch(push('/login/plugin-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToMnemonicImportMethod = () => (dispatch) => {
  dispatch(push('/login/mnemonic-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToPrivateKeyImportMethod = () => (dispatch) => {
  dispatch(push('/login/private-key-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(push('/login/select-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToLoginPage = () => (dispatch) => {
  dispatch(push('/login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToResetPasswordPage = () => (dispatch) => {
  dispatch(push('/login/reset-password'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToRecoverAccountPage = () => (dispatch) => {
  dispatch(push('/login/recover-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToGenerateMnemonicPage = () => (dispatch) => {
  dispatch(push('/login/mnemonic'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToWalletUploadMethod = () => (dispatch) => {
  dispatch(push('/login/upload-wallet'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToLoginLocal = () => (dispatch) => {
  dispatch(push('/login/local-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToAccountName = () => (dispatch) => {
  dispatch(push('/login/account-name'))
}

// #endregion
