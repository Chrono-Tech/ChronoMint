/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

// #region imports

import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import { login } from '@chronobank/core/redux/session/actions'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import {
  DUCK_NETWORK,
} from './constants'
import * as NetworkActions from './actions'
import privateKeyProvider from '../../network/privateKeyProvider'
import networkService from '../../network/NetworkService'
import {
  LOCAL_PRIVATE_KEYS,
} from '../../network/settings'
import * as networkUtils from './utils'
import setup from '../../network/EngineUtils'

// #endregion

// #region perform-like thunks

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: maybe it is better to join all these actions below into one actions and one reducer
 */
export const resetAllLoginFlags = () => (dispatch) => {
  dispatch(NetworkActions.networkResetImportPrivateKey())
  dispatch(NetworkActions.networkResetImportWalletFile())
  dispatch(NetworkActions.networkResetImportAccountMode())
  dispatch(NetworkActions.networkResetAccountRecoveryMode())
  dispatch(NetworkActions.networkResetNewMnemonic())
  dispatch(NetworkActions.networkResetNewAccountCredential())
  dispatch(NetworkActions.networkResetWalletFileImported())
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const updateSelectedAccount = () => (dispatch, getState) => {
  const state = getState()

  const {
    selectedWallet,
    walletsList,
  } = state.get(DUCK_PERSIST_ACCOUNT)

  const foundAccount = walletsList
    .find((account) =>
      account.key === selectedWallet.key
    )

  if (foundAccount) {
    dispatch(PersistAccountActions.accountSelect(foundAccount))
  }
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initAccountsSignature = () =>
  async (dispatch, getState) => {
    const state = getState()

    const { loadingAccountSignatures } = state.get(DUCK_NETWORK)
    const { walletsList } = state.get(DUCK_PERSIST_ACCOUNT)

    if (loadingAccountSignatures || !walletsList.length) {
      return
    }

    dispatch(NetworkActions.loadingAccountsSignatures())

    const accounts = await dispatch(PersistAccountActions.setProfilesForAccounts(walletsList))

    accounts.forEach((account) =>
      dispatch(PersistAccountActions.accountUpdate(account))
    )

    dispatch(updateSelectedAccount())
    dispatch(NetworkActions.resetLoadingAccountsSignatures())
  }

export const handleWalletLogin = (wallet, password) => async (dispatch, getState) => {
  dispatch(NetworkActions.loading())
  dispatch(NetworkActions.clearErrors())

  let state = getState()
  const provider = networkUtils.getWalletProvider(wallet[0], password)

  networkService.selectAccount(provider.ethereum.getAddress())
  await setup(provider)

  state = getState()
  const {
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  } = state.get(DUCK_NETWORK)

  dispatch(NetworkActions.clearErrors())

  const isPassed = await networkService.checkNetwork()

  if (isPassed) {
    networkService.createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )
    await dispatch(login(selectedAccount))
  }

}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const initRecoverAccountPage = () => (dispatch) => {
  dispatch(NetworkActions.networkResetNewMnemonic())
  dispatch(NetworkActions.networkSetAccountRecoveryMode())
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
    const wallets = state.get('ethMultisigWallet') // FIXME: to use constant

    const index = Math.max(accounts.indexOf(account), 0)
    const provider = privateKeyProvider.getPrivateKeyProvider(
      LOCAL_PRIVATE_KEYS[index],
      networkService.getProviderSettings(),
      wallets,
    )
    networkService.selectAccount(account)
    await setup(provider)

    state = getState()
    const {
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    } = state.get(DUCK_NETWORK)

    dispatch(NetworkActions.clearErrors())

    const isPassed = await networkService.checkNetwork(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    )

    if (isPassed) {
      networkService.createNetworkSession(
        selectedAccount,
        selectedProviderId,
        selectedNetworkId,
      )
      dispatch(login(selectedAccount))
    }
  }

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 * TODO: this is not an action, to refactor it
 */
export const selectProviderWithNetwork = (networkId, providerId) => (dispatch) => {
  dispatch(NetworkActions.networkSetProvider(providerId))
  dispatch(NetworkActions.networkSetNetwork(networkId))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const handleSubmitCreateNetwork = (url, ws, alias) => (dispatch) => {
  dispatch(PersistAccountActions.customNetworkCreate(url, ws, alias))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const handleSubmitEditNetwork = (network) => (dispatch) => {
  dispatch(PersistAccountActions.customNetworkEdit(network))
}

/*
 * Thunk dispatched by "" screen.
 * TODO: to add description
 */
export const handleDeleteNetwork = (network) => (dispatch) => {
  dispatch(PersistAccountActions.customNetworksDelete(network))
}

// #endregion
