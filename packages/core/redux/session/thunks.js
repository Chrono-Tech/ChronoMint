/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getNetworkById, LOCAL_ID, LOCAL_PRIVATE_KEYS, LOCAL_PROVIDER_ID, NETWORK_MAIN_ID } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import * as NetworkActions from '@chronobank/login/redux/network/actions'
import { removeWatchersUserMonitor } from '@chronobank/core-dependencies/redux/ui/actions'
import { push, replace } from '@chronobank/core-dependencies/router'
import LocalStorage from '@chronobank/core-dependencies/utils/LocalStorage'
import web3Provider from '@chronobank/login/network/Web3Provider'
import setup from '@chronobank/login/network/EngineUtils'
import * as SessionActions from './actions'
import * as ProfileThunks from '../profile/thunks'
import ProfileService from '../profile/service'
import { daoByType } from '../../redux/daos/selectors'
import web3Factory from '../../web3'
import { watcher } from '../watcher/actions'
import { watchStopMarket } from '../market/actions'
import { initEthereum } from '../ethereum/actions'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'
import { DEFAULT_CBE_URL, DEFAULT_USER_URL, DUCK_SESSION } from './constants'

const ERROR_NO_ACCOUNTS = 'Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.'

export const getAccounts = () => (dispatch, getState) => {
  const state = getState()
  const accounts = state.get(DUCK_NETWORK).accounts
  return accounts
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

// TODO: unnecessary thunk, need to use getProviderSettings instead...
export const getProviderURL = () => (dispatch) => {
  const providerSettings = dispatch(getProviderSettings())
  return providerSettings.url
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

export const selectProvider = (selectedProviderId) => (dispatch) => {
  dispatch(NetworkActions.networkResetNetwork())
  dispatch(NetworkActions.networkSetProvider(selectedProviderId))
}

export const restoreLocalSession = (account, wallets) => async (dispatch) => {
  dispatch(selectProvider(LOCAL_PROVIDER_ID))
  dispatch(NetworkActions.networkSetNetwork(LOCAL_ID))
  dispatch(NetworkActions.selectAccount(account))

  const accounts = await dispatch(loadAccounts())
  const index = Math.max(accounts.indexOf(account), 0)
  const providerSetting = dispatch(getProviderSettings())
  const provider = privateKeyProvider.getPrivateKeyProvider(LOCAL_PRIVATE_KEYS[index], providerSetting, wallets)
  await setup(provider)

  return true
}

export const changeGasSlideValue = (value, blockchain) => (dispatch) =>
  dispatch(SessionActions.gasSliderMultiplierChange(value, blockchain))

export const destroyNetworkSession = (lastURL, isReset = true) => (dispatch) => {
  if (isReset) {
    // for tests
    web3Provider.beforeReset()
    web3Provider.afterReset()
  }

  LocalStorage.setLastURL(lastURL)
  LocalStorage.destroySession()
  dispatch(SessionActions.sessionDestroy())
}

export const createNetworkSession = (account, provider, network) => (dispatch) => {
  // TODO: check it, maybe we do not need to set accounts here...
  // if (!this._account) {
  //   this._account = account
  // }
  dispatch(NetworkActions.networkSetAccounts([account]))

  if (!account || !provider || !network) {
    throw new Error(`Wrong session arguments: account: ${account}, provider: ${provider}, network: ${network}`)
  }

  LocalStorage.createSession(account, provider, network)
  dispatch(SessionActions.sessionCreate(account))
}

export const logout = () => async (dispatch, getState) => {
  try {
    const { selectedNetworkId } = getState().get(DUCK_NETWORK)
    dispatch(removeWatchersUserMonitor())
    dispatch(watchStopMarket())
    dispatch(destroyNetworkSession(`${window.location.pathname}${window.location.search}`))
    dispatch(push('/'))
    if (selectedNetworkId === NETWORK_MAIN_ID) {
      location.reload()
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  const state = getState()

  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  if (!state.get(DUCK_SESSION).isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }

  const web3 = typeof window !== 'undefined'
    ? web3Factory(network)
    : null

  await dispatch(initEthereum({ web3 }))
  await dispatch(watcher({ web3 }))

  const userManagerDAO = daoByType('UserManager')(getState())
  const [profile /*memberId*/] = await Promise.all([
    userManagerDAO.getMemberProfile(account, web3),
    userManagerDAO.getMemberId(account),
  ])

  dispatch(SessionActions.sessionProfile(profile, false))

  const defaultURL = DEFAULT_USER_URL

  dispatch(replace(LocalStorage.getLastURL() || defaultURL))
}

export const bootstrap = () => async () => {
  return true //FIXME remove method
}

export const getProfileSignature = (signer,path) => async (dispatch) => {
  if (!signer) {
    return
  }
  try {
    const signDataString = ProfileService.getSignData()
    const signData = await signer.signData(signDataString,path)
    console.log(signData)
    const profileSignature = await dispatch(ProfileThunks.getUserProfile(signData.signature))
    dispatch(SessionActions.setProfileSignature(profileSignature))

    return profileSignature
  } catch (error) {
    // FIXME: to handle it in appropriate way
    // eslint-disable-next-line no-console
    console.log('Unhadled error at core/redux/session/thunks: getProfileSignature:', error)
  }
}

export const updateUserProfile = (profile) => async (dispatch, getState) => {
  const { profileSignature } = getState().get(DUCK_SESSION)
  const newProfile = await dispatch(ProfileThunks.updateUserProfile(profile))

  dispatch(SessionActions.setProfileSignature({
    ...profileSignature,
    profile: newProfile,
  }))
}
