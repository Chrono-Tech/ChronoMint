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
import { replace } from 'react-router-redux'
import { DUCK_ETH_MULTISIG_WALLET } from '@chronobank/core/redux/multisigWallet/constants'
import { WALLET_TYPE_MEMORY, WALLET_TYPE_DEVICE } from '@chronobank/core/models/constants/AccountEntryModel'
import { AccountEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import { getEthereumSigner } from '@chronobank/core/redux/persistAccount/selectors'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
// import walletProvider from '@chronobank/login/network/walletProvider'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import setup from '@chronobank/login/network/EngineUtils'
import localStorage from 'utils/LocalStorage'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import * as NetworkThunks from '@chronobank/login/redux/network/thunks'
import * as SessionThunks from '@chronobank/core/redux/session/thunks'
import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import * as DeviceActions from '@chronobank/core/redux/device/actions'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import { checkTestRPC } from '@chronobank/login/redux/network/utils'
import {
  createAccountEntry,
} from '@chronobank/core/redux/persistAccount/utils'
import {
  isLocalNode,
  LOCAL_PRIVATE_KEYS,
} from '@chronobank/login/network/settings'
import * as LoginUINavActions from './navigation'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
  FORM_FOOTER_EMAIL_SUBSCRIPTION,
} from './constants'
import {AccountModel} from "../../core/models";
import {accountLoad} from "../../core/redux/persistAccount/actions";

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateAccountFromHW = (address) => (dispatch) => {
  dispatch(NetworkActions.networkSetAccounts(address))
  dispatch(LoginUINavActions.navigateToCreateHWAccount())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const navigateToCreateAccountWithoutImport = () => (dispatch) => {
  dispatch(LoginUINavActions.navigateToCreateAccount())
}

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

  const accountWallet = new AccountEntryModel(selectedWallet)

  console.log('Selected wallet: ', selectedWallet, accountWallet)

  switch (accountWallet.type) {

    case WALLET_TYPE_MEMORY: {
      try {
        const wallet = await dispatch(PersistAccountActions.decryptAccount(accountWallet, password))
        console.log('wallet: ', wallet)

        await dispatch(PersistAccountActions.accountLoad(wallet))
        const signer = getEthereumSigner(getState())
        console.log('wallet memory: signer: ', signer, accountWallet.encrypted[0].path)

        await dispatch(SessionThunks.getProfileSignature(signer, accountWallet.encrypted[0].path))

        //await dispatch(NetworkThunks.handleLogin(wallet.entry.encrypted[0].address))
        dispatch(NetworkActions.selectAccount(accountWallet.encrypted[0].address))
        //await setup(provider)
        const {
          selectedAccount,
          selectedProviderId,
          selectedNetworkId,
        } = getState().get(DUCK_NETWORK)
        dispatch(NetworkActions.clearErrors())

        dispatch(SessionThunks.createNetworkSession(
          selectedAccount,
          selectedProviderId,
          selectedNetworkId,
        ))

        localStorage.createSession(selectedAccount, selectedProviderId, selectedNetworkId)
        const defaultURL = await dispatch(SessionThunks.login(selectedAccount))

        dispatch(replace(localStorage.getLastURL() || defaultURL))
      } catch (e) {
        console.log('Login MEMORY Error: ', e)
        throw new SubmissionError({ password: e && e.message })
      }
      break
    }

    case WALLET_TYPE_DEVICE: {
      try {
        console.log('WALLET_TYPE_DEVICE AccountModel: ', accountWallet)
        const wallet = await dispatch(DeviceActions.loadDeviceAccount(accountWallet))
        console.log('WALLET_TYPE_DEVICE: ', wallet)
        const signer = getEthereumSigner(getState())
        console.log('WALLET_TYPE_DEVICE signer: ', signer, wallet)

        await dispatch(SessionThunks.getProfileSignature(signer, wallet.entry.encrypted[0].path))

        //await dispatch(NetworkThunks.handleLogin(wallet.entry.encrypted[0].address))
        dispatch(NetworkActions.selectAccount(wallet.entry.encrypted[0].address))
        //await setup(provider)
        dispatch(NetworkActions.loading())
        dispatch(NetworkActions.clearErrors())

        const {
          selectedAccount,
          selectedProviderId,
          selectedNetworkId,
        } = getState().get(DUCK_NETWORK)
        dispatch(NetworkActions.clearErrors())

        dispatch(SessionThunks.createNetworkSession(
          selectedAccount,
          selectedProviderId,
          selectedNetworkId,
        ))
        localStorage.createSession(selectedAccount, selectedProviderId, selectedNetworkId)
        const defaultURL = await dispatch(SessionThunks.login(selectedAccount))

        dispatch(replace(localStorage.getLastURL() || defaultURL))
      } catch (e) {
        console.log('Login DEVICE Error: ', e)
        throw new SubmissionError({ password: e && e.message })
      }
      break

    }
  }

  // try {
  //
  //   const wallet = dispatch(PersistAccountActions.decryptAccount(selectedWallet.encrypted, password))
  //   console.log('onSubmitLoginForm: ', selectedWallet, wallet)
  //
  //   dispatch(PersistAccountActions.accountLoad(new SignerMemoryModel({ wallet })))
  //
  //   const privateKey = wallet && wallet[0] && wallet[0].privateKey
  //
  //   if (privateKey) {
  //     dispatch(SessionThunks.getProfileSignature(wallet[0]))
  //     // Code below prevously was handleWalletLogin
  //     dispatch(NetworkActions.loading())
  //     dispatch(NetworkActions.clearErrors())
  //     const providerSettings = dispatch(SessionThunks.getProviderSettings())
  //     const provider = walletProvider.getProvider(
  //       selectedWallet.encrypted[0],
  //       password,
  //       providerSettings,
  //     )
  //     dispatch(NetworkActions.selectAccount(provider.ethereum.getAddress()))
  //     await setup(provider)
  //     const state = getState()
  //     const {
  //       selectedAccount,
  //       selectedProviderId,
  //       selectedNetworkId,
  //     } = state.get(DUCK_NETWORK)
  //
  //     dispatch(NetworkActions.clearErrors())
  //     dispatch(SessionThunks.createNetworkSession(
  //       selectedAccount,
  //       selectedProviderId,
  //       selectedNetworkId,
  //     ))
  //     localStorage.createSession(selectedAccount, selectedProviderId, selectedNetworkId)
  //     const defaultURL = await dispatch(SessionThunks.login(selectedAccount))
  //     dispatch(replace(localStorage.getLastURL() || defaultURL))
  //   }
  // } catch (e) {
  //   // eslint-disable-next-line no-console
  //   console.log('Error in onSubmitLoginForm:', e)
  //   throw new SubmissionError({ password: e && e.message })
  // }
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
      console.log('onSubmitImportAccount: ', name, password, mnemonic, privateKey )

      const wallet = await dispatch(PersistAccountActions.createAccount({
        name,
        password,
        mnemonic,
        privateKey,
        type: WALLET_TYPE_MEMORY,
        numberOfAccounts: 0,
      }))

      console.log('PersistAccountActions.createAccount: ', wallet)

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
      newAccountPrivateKey,
    } = state.get(DUCK_NETWORK)

    try {
      const wallet = await dispatch(PersistAccountActions.createHWAccount({
        name: walletName,
        pupblicKey: newAccountPrivateKey,
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
    dispatch(NetworkActions.networkResetLoginSubmitting())
    dispatch(NetworkThunks.initAccountsSignature())

    const state = getState()
    const {
      selectedWallet,
      walletsList,
    } = state.get(DUCK_PERSIST_ACCOUNT)

    if (walletsList && !walletsList.length) {
      dispatch(LoginUINavActions.navigateToCreateAccount())
    }

    if (!selectedWallet) {
      dispatch(LoginUINavActions.navigateToSelectWallet())
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
  dispatch(LoginUINavActions.navigateToLoginPage())
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
    dispatch(LoginUINavActions.navigateToLoginLocal())
  }
}

export const onWalletSelect = (wallet) => (dispatch) => {
  dispatch(PersistAccountActions.accountSelect(wallet))
  dispatch(LoginUINavActions.navigateToLoginPage())
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

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to rework it
 */
export const handleLoginLocalAccountClick = (account = '') =>
  async (dispatch, getState) => {
    let state = getState()
    const { accounts } = state.get(DUCK_NETWORK)
    const wallets = state.get(DUCK_ETH_MULTISIG_WALLET)
    const providerSetting = dispatch(SessionThunks.getProviderSettings())
    const index = Math.max(accounts.indexOf(account), 0)
    const provider = privateKeyProvider.getPrivateKeyProvider(
      LOCAL_PRIVATE_KEYS[index],
      providerSetting,
      wallets,
    )
    dispatch(NetworkActions.selectAccount(account))
    await setup(provider)

    state = getState()
    const {
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    } = state.get(DUCK_NETWORK)

    dispatch(NetworkActions.clearErrors())

    dispatch(SessionThunks.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    ))
    localStorage.createSession(selectedAccount, selectedProviderId, selectedNetworkId)
    const defaultURL = await dispatch(SessionThunks.login(selectedAccount))
    dispatch(replace(localStorage.getLastURL() || defaultURL))
  }
