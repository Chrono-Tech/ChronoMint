/**
 * Copyright 2017–2019, LaborX PTY
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
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_LEDGER,
} from '@chronobank/core/models/constants/AccountEntryModel'
import { AccountEntryModel } from '@chronobank/core/models/wallet/persistAccount'
import { getEthereumSigner } from '@chronobank/core/redux/ethereum/selectors'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
import localStorage from 'utils/LocalStorage'
import {
  DUCK_NETWORK,
} from '@chronobank/login/redux/network/constants'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import * as Utils from '@chronobank/core/redux/ethereum/utils'
import {
  DUCK_PERSIST_ACCOUNT,
  DEFAULT_ACTIVE_BLOCKCHAINS,
  WALLETS_CACHE_ADDRESS,
} from '@chronobank/core/redux/persistAccount/constants'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/login/network/constants'
import { getAddressCache } from '@chronobank/core/redux/persistAccount/selectors'
import * as NetworkThunks from '@chronobank/login/redux/network/thunks'
import * as SessionThunks from '@chronobank/core/redux/session/thunks'
import { modalsOpen, modalsClose } from '@chronobank/core/redux/modals/actions'
import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import * as DeviceActions from '@chronobank/core/redux/device/actions'
import PublicBackendProvider from '@chronobank/login/network/PublicBackendProvider'
import {
  createAccountEntry,
  createDeviceAccountEntry,
} from '@chronobank/core/redux/persistAccount/utils'
import * as LoginUINavActions from './navigation'
import {
  FORM_LOGIN_PAGE,
  FORM_LOGIN_PAGE_FIELD_SUCCESS_MESSAGE,
  FORM_FOOTER_EMAIL_SUBSCRIPTION,
} from './constants'
import userMonitorService from './userMonitorService'
import { checkNetwork } from './utils'

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
export const initCommonNetworkSelector = () => (dispatch) => {
  dispatch(NetworkThunks.autoSelect())
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
  const { selectedWallet, lastLoginNetworkId } = state.get(DUCK_PERSIST_ACCOUNT)
  const accountWallet = new AccountEntryModel(selectedWallet)
  const { network } = getCurrentNetworkSelector(state)
  const { selectedNetworkId, selectedProviderId } = getState().get(DUCK_NETWORK)
  if (lastLoginNetworkId !== selectedNetworkId) {
    dispatch(PersistAccountActions.clearWalletsAddressCache())
  }
  const availableNetwork = await checkNetwork(selectedNetworkId, selectedProviderId)
  if (availableNetwork) {
    if (availableNetwork.selectedNetworkId !== selectedNetworkId) {
      dispatch(NetworkActions.networkSetNetwork(availableNetwork.selectedNetworkId))
    }
    if (availableNetwork.selectedProviderId !== selectedProviderId) {
      dispatch(NetworkActions.networkSetProvider(availableNetwork.selectedProviderId))
      dispatch(NetworkActions.disableProvider(selectedProviderId))
    }
  }

  dispatch(PersistAccountActions.updateLastNetworkId(availableNetwork ? availableNetwork.selectedNetworkId : selectedNetworkId))

  switch (accountWallet.type) {
    case WALLET_TYPE_MEMORY: {
      try {
        const wallet = await dispatch(PersistAccountActions.decryptAccount(accountWallet, password))
        await dispatch(PersistAccountActions.accountLoad(wallet))

        dispatch(NetworkActions.selectAccount(accountWallet.address))

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
        const signer = getEthereumSigner(getState())
        await dispatch(SessionThunks.getProfileSignature(signer, accountWallet.encrypted[0].path))
      } catch (e) {
        //eslint-disable-next-line
        console.warn('Memory type error: ', e)
        throw new SubmissionError({ password: e && e.message })
      }
      break
    }

    case WALLET_TYPE_TREZOR:
    case WALLET_TYPE_LEDGER: {
      try {

        const wallet = await dispatch(DeviceActions.loadDeviceAccount(accountWallet))
        const { address } = wallet.entry.encrypted[0]
        const path = Utils.getEthereumDerivedPath(network[BLOCKCHAIN_ETHEREUM])
        const signer = getEthereumSigner(getState())
        const addressCache = { ...getAddressCache(state) }
        const signerAddress = await signer.getAddress(path)

        if (addressCache[BLOCKCHAIN_ETHEREUM] && signerAddress !== addressCache[BLOCKCHAIN_ETHEREUM].address) {
          //eslint-disable-next-line
          console.error(`Different device for this account [${signerAddress}] [${addressCache[BLOCKCHAIN_ETHEREUM].address}]`)
          throw new Error('Different device for this account')
        }

        dispatch({
          type: WALLETS_CACHE_ADDRESS,
          blockchain: BLOCKCHAIN_ETHEREUM,
          address: signerAddress,
          path,
        })

        dispatch(NetworkActions.selectAccount(address))
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

        // after login
        dispatch(SessionThunks.getProfileSignatureForDevice(signer, path))

        dispatch(replace(localStorage.getLastURL() || defaultURL))
      } catch (e) {
        //eslint-disable-next-line
        console.warn('Device type error: ', e)
        throw new SubmissionError({ _error: e && e.message })
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
export const onSubmitCreateAccountImportMnemonic = (name, password, mnemonic, blockchainList) => async (dispatch) => {
  await dispatch(onSubmitImportAccount({
    name,
    password,
    mnemonic,
    blockchainList,
  }))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to remove throws
 * TODO: to rework it
 */
export const onSubmitCreateAccountImportPrivateKey = (name, password, privateKey, blockchainList) => async (dispatch) => {
  await dispatch(onSubmitImportAccount({
    name,
    password,
    privateKey,
    blockchainList,
  }))
}

/*
 * Thunk dispatched by
 * LoginWithMnemonic, LoginWithPrivateKey screen.
 */
export const onSubmitImportAccount = ({ name, password, mnemonic = '', privateKey = '', blockchainList = DEFAULT_ACTIVE_BLOCKCHAINS }) => async (dispatch) => {
  try {
    const account = await dispatch(PersistAccountActions.createMemoryAccount({
      name,
      password,
      mnemonic,
      privateKey,
    }))

    account.blockchainList = blockchainList
    dispatch(PersistAccountActions.accountAdd(account))
    dispatch(PersistAccountActions.accountSelect(account))

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

/**
 * Thunk dispatched by "" screen.
 * @name name of account on login page
 * @walletObject it's an object of encrypted wallet. Result of Web3 1.0 wallet.encrypt function
 * @see https://web3js.readthedocs.io/en/1.0/web3-eth-accounts.html#wallet-encrypt
 * @profile
 **/
export const onCreateWalletFromJSON = (name, walletObject, profile) => (dispatch) => {
  const account = createAccountEntry(name, walletObject, profile)
  dispatch(PersistAccountActions.accountAdd(account))
  dispatch(PersistAccountActions.accountSelect(account))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: to move logic to utils
*/
export const onCreateWalletFromDevice = (name, device, profile, walletType, activeBlockchainList = DEFAULT_ACTIVE_BLOCKCHAINS) => (dispatch) => {
  const account = createDeviceAccountEntry(name, device, profile, walletType, activeBlockchainList)
  dispatch(PersistAccountActions.accountAdd(account))
  dispatch(PersistAccountActions.accountSelect(account))
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

export const onWalletSelect = (wallet) => (dispatch) => {
  dispatch(PersistAccountActions.accountSelect(wallet))
  dispatch(LoginUINavActions.navigateToLoginPage())
}

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

export const startUserMonitorAndCloseModals = () => (dispatch) => {
  userMonitorService.start()
  dispatch(modalsClose())
}

export const stopUserMonitor = () => () => {
  userMonitorService.stop()
}

export const removeWatchersUserMonitor = () => () => {
  userMonitorService
    .removeAllListeners('active')
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  userMonitorService
    .on('active', () => dispatch(modalsOpen({
      componentName: 'UserActiveDialog',
    })))
    .start()
}
