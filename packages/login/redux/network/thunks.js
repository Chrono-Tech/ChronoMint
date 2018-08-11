/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import contractsManagerDAO from '@chronobank/core/dao/ContractsManagerDAO'
import { login, createNetworkSession } from '@chronobank/core/redux/session/thunks'
import {
  DUCK_PERSIST_ACCOUNT,
} from '@chronobank/core/redux/persistAccount/constants'
import {
  DUCK_NETWORK,
} from './constants'
import * as NetworkActions from './actions'
import uportProvider from '../../network/uportProvider'
import privateKeyProvider from '../../network/privateKeyProvider'
import * as Utils from './utils'
import walletProvider from '../../network/walletProvider'
import setup from '../../network/EngineUtils'
import web3Provider from '../../network/Web3Provider'
import {
  getNetworkById,
  getNetworksByProvider,
  // getScannerById,
  // LOCAL_ID,
  LOCAL_PRIVATE_KEYS,
  LOCAL_PROVIDER_ID,
  NETWORK_MAIN_ID,
} from '../../network/settings'
import metaMaskResolver from '../../network/metaMaskResolver'

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

  const providerSettings = dispatch(getProviderSettings())
  const provider = walletProvider.getProvider(
    wallet[0],
    password,
    providerSettings,
  )

  dispatch(NetworkActions.selectAccount(provider.ethereum.getAddress()))
  await setup(provider)

  const state = getState()
  const {
    selectedAccount,
    selectedProviderId,
    selectedNetworkId,
  } = state.get(DUCK_NETWORK)

  dispatch(NetworkActions.clearErrors())

  const isPassed = await dispatch(checkNetwork())

  if (isPassed) {
    dispatch(createNetworkSession(
      selectedAccount,
      selectedProviderId,
      selectedNetworkId,
    ))
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
    const providerSetting = dispatch(getProviderSettings())
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

    // checkNetwork has no arguments. See the diff.
    const isPassed = await dispatch(checkNetwork())

    if (isPassed) {
      dispatch(createNetworkSession(
        selectedAccount,
        selectedProviderId,
        selectedNetworkId,
      ))
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

// TODO: actually, this method does not used. It is wrong. Need to be used
export const isMetaMask = () => (dispatch, getState) => {
  const state = getState()
  const network = state.get(DUCK_NETWORK)
  return network.isMetamask
}

export const checkMetaMask = () => (dispatch) => {
  const metaMaskHandler = (isMetaMask) => {
    if (isMetaMask) {
      dispatch(NetworkActions.setTestMetamask())
    }
  }

  metaMaskResolver
    .on('resolve', metaMaskHandler)
    .start()
}

export const loginUport = () => async (dispatch) => {
  const provider = uportProvider.getUportProvider()

  dispatch(NetworkActions.loading())
  dispatch(NetworkActions.clearErrors())

  web3Provider.reinit(provider.getWeb3(), provider.getProvider())
  const encodedAddress = await provider.requestAddress()
  const { network, address } = uportProvider.decodeMNIDaddress(encodedAddress)

  dispatch(NetworkActions.networkSetNetwork(web3Converter.hexToDecimal(network)))
  dispatch(NetworkActions.networkSetAccounts([address]))
  dispatch(NetworkActions.selectAccount(address))

  return true
}

export const checkLocalSession = (account, providerURL) => async (dispatch) => {
  const isTestRPC = Utils.checkTestRPC(providerURL)
  // testRPC must be exists
  if (!isTestRPC || !account) {
    return false
  }

  // contacts and network must be valid
  const isDeployed = await dispatch(checkNetwork())
  if (!isDeployed) {
    return false
  }

  // all tests passed
  return true
}

export const checkNetwork = () => async (dispatch) => {
  dispatch(NetworkActions.loading())
  const isDeployed = await contractsManagerDAO.isDeployed()
  if (!isDeployed) {
    dispatch(NetworkActions.addError('Network is unavailable.'))
  }
  //return isDeployed
  return true
}

// Need to think how to merge it with getProviderSettings method. Looks almost the same.
export const getNetworkName = () => (dispatch,getState ) => {
  const state = getState()
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
  const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
  const { name } = network

  if (!network.host) {
    const customNetwork = customNetworksList
      .find((network) => network.id === selectedNetworkId)

    return customNetwork && customNetwork.name
  }

  return name
}

// TODO: unnecessary thunk, need to use getProviderSettings instead...
export const getProviderURL = () => (dispatch, getState) => {
  const providerSettings = dispatch(getProviderSettings())
  return providerSettings.url
}

export const getAccounts = () => (dispatch, getState) => {
  const state = getState()
  const accounts = state.get(DUCK_NETWORK).accounts
  return accounts
}

export const selectProvider = (selectedProviderId) => (dispatch) => {
  dispatch(NetworkActions.networkResetNetwork())
  dispatch(NetworkActions.networkSetProvider(selectedProviderId))
}

export const getProviderSettings = () => (dispatch, getState) => {
  const state = getState()
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const { selectedNetworkId, selectedProviderId, isLocal } = state.get(DUCK_NETWORK)
  const network = getNetworkById(selectedNetworkId, selectedProviderId, isLocal)
  const { protocol, host } = network

  if (!host) {
    const customNetwork = customNetworksList
      .find((network) => network.id === selectedNetworkId)

    return {
      network: customNetwork,
      url: customNetwork && customNetwork.url,
    }
  }

  return {
    network,
    url: protocol ? `${protocol}://${host}` : `//${host}`,
  }
}

export const restoreLocalSession = (account, wallets) => async (dispatch) => {
  dispatch(selectProvider(LOCAL_PROVIDER_ID))
  dispatch(NetworkActions.networkSetNetwork(selectedNetworkId))
  dispatch(NetworkActions.selectAccount(account))

  const accounts = await dispatch(loadAccounts())
  const index = Math.max(accounts.indexOf(account), 0)
  const providerSetting = dispatch(getProviderSettings())
  const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], providerSetting, wallets)
  await setup(provider)

  return true
}

export const loadAccounts = () => async (dispatch) => {
  dispatch(NetworkActions.loading())
  dispatch(NetworkActions.networkSetAccounts([]))
  try {
    let accounts = dispatch(getAccounts())
    if (accounts == null) {
      accounts = await web3Provider.getAccounts()
    }
    if (!accounts || accounts.length === 0) {
      throw new Error(ERROR_NO_ACCOUNTS)
    }
    dispatch(NetworkActions.networkSetAccounts(accounts))
    if (accounts.length === 1) {
      dispatch(NetworkActions.selectAccount(accounts[0]))
    }
    dispatch(NetworkActions.loading(false))
    return accounts
  } catch (e) {
    dispatch(NetworkActions.addError(e.message))
  }
}

export const autoSelect = (network) => (dispatch, getState) => {
  const { priority, preferMainnet } = getState().get(DUCK_NETWORK)
  let checkerIndex = 0
  let checkers = []

  const selectAndResolve = (networkId, providerId) => {
    dispatch(selectProvider(providerId))
    dispatch(NetworkActions.networkSetNetwork(networkId))
  }

  const handleNetwork = (status) => {
    switch (status) {
      case NETWORK_STATUS_OFFLINE:
        runNextChecker()
        break
      case NETWORK_STATUS_ONLINE:
        resetCheckers()
        break
    }
  }

  const resetCheckers = () => {
    checkerIndex = 0
    checkers.length = checkerIndex
    web3Provider.getMonitorService().removeListener('network', handleNetwork)
  }

  const runNextChecker = () => {
    if (checkerIndex < checkers.length) {
      web3Provider.beforeReset()
      web3Provider.afterReset()
      checkers[checkerIndex]()
      checkerIndex++
    } else {
      resetCheckers()
    }
  }

  priority.forEach((providerId) => {
    const networks = getNetworksByProvider(providerId)
    if (preferMainnet) {
      checkers.push(() => selectAndResolve(NETWORK_MAIN_ID, providerId))
    } else {
      networks
        .filter((network) => network.id !== NETWORK_MAIN_ID)
        .forEach((network) => {
          checkers.push(() => selectAndResolve(network.id, providerId))
        })
    }
  })

  web3Provider
    .getMonitorService()
    .on('network', handleNetwork)

  runNextChecker()
}
