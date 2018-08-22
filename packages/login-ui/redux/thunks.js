/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

import {
  change,
  stopSubmit,
  SubmissionError,
} from 'redux-form'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import * as NetworkThunks from '@chronobank/login/redux/network/thunks'
import { getSigner } from '@chronobank/core/redux/persistAccount/selectors'
import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import * as DeviceActions from '@chronobank/core/redux/device/actions'
import * as SessionThunks from '@chronobank/core/redux/session/thunks'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import { AccountEntryModel } from '@chronobank/core/models'
import { EthereumMemoryDevice } from '@chronobank/core/services/signers/EthereumMemoryDevice'
import { checkTestRPC } from '@chronobank/login/redux/network/utils'
import {
  createAccountEntry,
  createDeviceAccountEntry,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  isLocalNode,
} from '@chronobank/login/network/settings'
import * as LoginUIActions from './actions'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
  FORM_FOOTER_EMAIL_SUBSCRIPTION,
} from './constants'

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(LoginUIActions.navigateToCreateAccount())
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

  dispatch(NetworkThunks.autoSelect())

  if (!isLocal) {
    checkTestRPC()
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
  dispatch(NetworkActions.networkSetLoginSubmitting())

  const state = getState()
  const { selectedWallet } = state.get(DUCK_PERSIST_ACCOUNT)
  const wlt = new AccountEntryModel(selectedWallet)
  console.log(wlt) 
    switch(wlt.type) {
     case 'memory' : {
      try {
        const wallet = await dispatch(PersistAccountActions.decryptAccount(wlt, password))
	console.log(wallet.entry.encrypted[0].address)
	const signer = getSigner(getState())
	console.log(signer)
        await dispatch(SessionThunks.getProfileSignature(signer,wallet.entry.encrypted[0].path))
	      
        await dispatch(NetworkThunks.handleLogin(wallet.entry.encrypted[0].address))
      } catch (e) {
        throw new SubmissionError({ password: e && e.message })
      }
      break
     }

     case 'device': {
      
      console.log('navigate to device login')
      try {
        const wallet = await dispatch(DeviceActions.loadDeviceAccount(wlt))
        console.log(wallet.entry.encrypted[0].address)
	const signer = getSigner(state)
	console.log(signer)
        dispatch(SessionThunks.getProfileSignature(signer,wallet.entry.encrypted[0].path))
        
        await dispatch(NetworkThunks.handleLogin(wallet.entry.encrypted[0].address))
      } catch (e) {
        throw new SubmissionError({ password: e && e.message })
      }
      break
    }
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
      let wallet = await dispatch(PersistAccountActions.createMemoryAccount({
        name,
        password,
        mnemonic,
        privateKey,
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
 * TODO: to move logic to utils
*/
export const onCreateWalletFromJSON = (name, walletJSON, profile) => (dispatch) => {
  const account = createAccountEntry(name, walletJSON, profile)

  dispatch(PersistAccountActions.accountAdd(account))

}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to move logic to utils
*/
export const onCreateWalletFromDevice = (name, device, profile) => (dispatch) => {
	
  const account = createDeviceAccountEntry(name, device, profile)

  dispatch(PersistAccountActions.accountAdd(account))

}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initLoginPage = () =>
  (dispatch, getState) => {
    dispatch(NetworkThunks.resetAllLoginFlags())
    dispatch(NetworkActions.networkResetLoginSubmitting())
    dispatch(NetworkThunks.initAccountsSignature())

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

export const onWalletSelect = (wallet) => async (dispatch) => {
  console.log(wallet)
  dispatch(PersistAccountActions.accountSelect(wallet))
  dispatch(LoginUIActions.navigateToLoginPage())
}

export const onDeviceSelect = (device) => (dispatch) => {

  dispatch(DeviceActions.deviceSelect(device))

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
