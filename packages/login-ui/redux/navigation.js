/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  goBack,
  push,
} from 'connected-react-router/immutable'

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
  dispatch(push('/create-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateHWAccount = () => (dispatch) => {
  dispatch(push('/create-hw-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToSelectImportMethod = () => (dispatch) => {
  dispatch(push('/import-methods'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToTrezorImportMethod = () => (dispatch) => {
  dispatch(push('/trezor-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToLedgerImportMethod = () => (dispatch) => {
  dispatch(push('/ledger-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToPluginImportMethod = () => (dispatch) => {
  dispatch(push('/plugin-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToMnemonicImportMethod = () => (dispatch) => {
  dispatch(push('/mnemonic-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToPrivateKeyImportMethod = () => (dispatch) => {
  dispatch(push('/private-key-login'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToSelectWallet = () => (dispatch) => {
  dispatch(push('/select-account'))
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
  dispatch(push('/recover-account'))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToWalletUploadMethod = () => (dispatch) => {
  dispatch(push('/upload-wallet'))
}
