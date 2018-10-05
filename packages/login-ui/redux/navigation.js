/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  goBack,
  push,
} from 'connected-react-router'

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
export const navigateToRecoverAccountPage = () => (dispatch) => {
  dispatch(push('/login/recover-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToWalletUploadMethod = () => (dispatch) => {
  dispatch(push('/login/upload-wallet'))
}
