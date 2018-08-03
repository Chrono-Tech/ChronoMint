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

// #region navigation

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
// eslint-disable-next-line no-unused-vars
export const initAccountNamePage = () => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitSubscribeNewsletterSuccess and delete this thunk
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitSubscribeNewsletterSuccess = () => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitMnemonicLoginFormSuccess and delete this thunk
 */
export const onSubmitAccountNameSuccess = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToLoginPage())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitAccountNameFail and delete this thunk
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitAccountNameFail = (errors, submitErrors) => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitMnemonicLoginFormSuccess and delete this thunk
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitWalletUploadSuccess = () => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitMnemonicLoginFormSuccess and delete this thunk
 */
// eslint-disable-next-line no-unused-vars
export const onSubmitCreateAccountPageSuccess = () => (dispatch) => {
  // FIXME: empty thunk
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitRecoverAccountFormSuccess and delete this thunk
 */
export const onSubmitRecoverAccountFormSuccess = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToResetPasswordPage())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitMnemonicLoginFormSuccess and delete this thunk
 */
export const onSubmitMnemonicLoginFormSuccess = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToCreateAccount())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to replace all onSubmitMnemonicLoginFormSuccess and delete this thunk
 */
export const onSubmitPrivateKeyLoginFormSuccess = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToCreateAccount())
}

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

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initResetPasswordPage = () => (dispatch, getState) => {
  const state = getState()
  const { accountRecoveryMode } = state.get(DUCK_NETWORK)

  if (!accountRecoveryMode) {
    dispatch(LoginUIActions.navigateToRecoverAccountPage())
  }
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

  const subscriptionsService = await axios.create({
    baseURL: publicBackendProvider.getPublicHost(),
  })

  try {
    await subscriptionsService.options('/api/v1/subscriptions')
    await subscriptionsService.post('/api/v1/subscriptions', { email })
  } catch (e) {
    throw new SubmissionError({ _error: e && e.message })
  }
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to extract logic from here
 * TODO: to add I18n translation
 * TODO: to dispatch something, this is not a thunk or action. Really..
 */
export const onSubmitConfirmMnemonic = (confirmMnemonic) => (dispatch, getState) => {
  const state = getState()
  const { newAccountMnemonic } = state.get(DUCK_NETWORK)

  if (confirmMnemonic !== newAccountMnemonic) {
    throw new SubmissionError({ _error: 'Please enter correct mnemonic phrase' })
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
export const onSubmitCreateAccountPage = (walletName, walletPassword) =>
  async (dispatch, getState) => {
    const state = getState()

    const {
      importAccountMode,
      newAccountMnemonic,
      newAccountPrivateKey,
      walletFileImportMode,
    } = state.get(DUCK_NETWORK)
    const validateName = dispatch(PersistAccountActions.validateAccountName(walletName))

    if (!validateName) {
      throw new SubmissionError({ walletName: 'Wrong wallet name' })
    }

    dispatch(NetworkActions.setAccountCredentials(walletName, walletPassword))

    if (importAccountMode) {
      try {
        let wallet = await dispatch(PersistAccountActions.createAccount({
          name: walletName,
          password: walletPassword,
          mnemonic: newAccountMnemonic,
          privateKey: newAccountPrivateKey,
          numberOfAccounts: 0,
        }))

        dispatch(PersistAccountActions.accountAdd(wallet))
        dispatch(PersistAccountActions.accountSelect(wallet))
        dispatch(NetworkActions.networkResetImportAccountMode())

        if (walletFileImportMode) {
          dispatch(LoginUIActions.navigateToSelectWallet())
        } else {
          dispatch(LoginUIActions.navigateToDownloadWalletPage())
        }
      } catch (e) {
        throw new SubmissionError({ _error: e && e.message })
      }

      return // FIXME: Excuse me, what?
    }

    dispatch(NetworkActions.generateNewMnemonic())
    dispatch(LoginUIActions.navigateToGenerateMnemonicPage())
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
 * TODO: to remove throws
 * TODO: to rework it
 * TODO: to move logic to utils
 */
export const onSubmitWalletUpload = (walletString) =>
  async (dispatch) => {
    let restoredWalletJSON

    try {
      restoredWalletJSON = JSON.parse(walletString)

      if ('Crypto' in restoredWalletJSON) {
        restoredWalletJSON.crypto = restoredWalletJSON.Crypto
        delete restoredWalletJSON.Crypto
      }
    } catch (e) {
      throw new SubmissionError({ _error: 'Broken wallet file' })
    }

    if (restoredWalletJSON && restoredWalletJSON.address) {
      let response

      try {
        response = await profileService.getPersonInfo([getAddress(restoredWalletJSON.address, true)])
      } catch (e) {
        throw new SubmissionError({ _error: 'Could not receive user profile' })
      }

      if (response && response.data && response.data[0] && response.data[0].userName) {
        const profile = response.data[0]
        const account = createAccountEntry(profile.userName, restoredWalletJSON, profile)

        dispatch(PersistAccountActions.accountAdd(account))
        dispatch(PersistAccountActions.accountSelect(account))
        dispatch(LoginUIActions.navigateToLoginPage())
      } else {
        dispatch(NetworkActions.setImportedWalletFile(restoredWalletJSON))
        dispatch(LoginUIActions.navigateToAccountName())
      }
    } else {
      throw new SubmissionError({ _error: 'Wrong wallet address' })
    }
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it
 */
export const initLoginLocal = () =>
  async (dispatch, getState) => {
    const state = getState()
    const {
      selectedNetworkId,
      selectedProviderId,
    } = state.get(DUCK_NETWORK)

    if (isLocalNode(selectedProviderId, selectedNetworkId)) {
      await networkService.loadAccounts()
    } else {
      dispatch(LoginUIActions.navigateToLoginPage())
    }
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initConfirmMnemonicPage = () => (dispatch, getState) => {
  const state = getState()
  const { newAccountMnemonic } = state.get(DUCK_NETWORK)

  if (!newAccountMnemonic) {
    dispatch(LoginUIActions.navigateToCreateAccount())
  }
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initMnemonicPage = () => (dispatch, getState) => {
  const state = getState()
  const {
    newAccountName,
    newAccountPassword,
  } = state.get(DUCK_NETWORK)
  const emptyAccountCredentials = !newAccountName || !newAccountPassword

  if (emptyAccountCredentials) {
    dispatch(LoginUIActions.navigateToCreateAccount())
  }
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
 */
export const onSubmitConfirmMnemonicSuccess = () => (dispatch) => {
  dispatch(NetworkActions.onSubmitConfirmMnemonicSuccess())
  dispatch(LoginUIActions.navigateToDownloadWalletPage())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to add translation
 * TODO: to remove text from here
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
 * TODO: to add I18n translation
 * TODO: to extract trimming and other logic from here
 */
export const onSubmitPrivateKeyLoginForm = (privateKey) => (dispatch) => {
  let pk = (privateKey || '').trim()

  if (!privateKeyProvider.validatePrivateKey(privateKey)) {
    throw new SubmissionError({ pk: 'Wrong private key' })
  }

  if (pk.slice(0, 2) === '0x') {
    pk = pk.slice(2)
  }

  dispatch(NetworkActions.networkSetImportPrivateKey(pk))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to extract trimming from here
 */
export const onSubmitMnemonicLoginForm = (mnemonic) =>
  async (dispatch) => {
    let mnemonicValue = (mnemonic || '').trim()

    if (!mnemonicProvider.validateMnemonic(mnemonicValue)) {
      throw new SubmissionError({ mnemonic: 'Invalid mnemonic' })
    }

    dispatch(NetworkActions.networkSetNewMnemonic(mnemonicValue))
  }

  /*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to remove throws
 * TODO: to rework it
 */
export const onSubmitRecoverAccountForm = (mnemonic) =>
  async (dispatch) => {
    const validForm = await dispatch(PersistAccountActions.validateMnemonicForAccount(mnemonic))

    if (!validForm) {
      throw new SubmissionError({ _error: 'Mnemonic incorrect for this wallet' })
    }

    dispatch(NetworkActions.networkSetNewMnemonic(mnemonic))
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
export const onSubmitCreateAccountPageFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CREATE_ACCOUNT, submitErrors && submitErrors.errors))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitConfirmMnemonicFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_CONFIRM_MNEMONIC, submitErrors && submitErrors.errors))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitMnemonicLoginFormFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_MNEMONIC_LOGIN_PAGE, submitErrors && submitErrors.errors))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitPrivateKeyLoginFormFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_PRIVATE_KEY_LOGIN_PAGE, submitErrors && submitErrors.errors))
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
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitRecoverAccountFormFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_RECOVER_ACCOUNT, submitErrors && submitErrors.errors))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitResetAccountPasswordFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_RESET_PASSWORD, submitErrors && submitErrors.errors))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it, merge into one action onSubmitPageFail
 */
export const onSubmitWalletUploadFail = (errors, submitErrors) => (dispatch) => {
  dispatch(stopSubmit(FORM_WALLET_UPLOAD, submitErrors && submitErrors.errors))
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
