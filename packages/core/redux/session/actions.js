/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { getNetworkById, LOCAL_ID, LOCAL_PROVIDER_ID, NETWORK_MAIN_ID } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import { daoByType } from '../../refactor/redux/daos/selectors'
import profileService from '@chronobank/login/network/ProfileService'
import { push, replace } from '@chronobank/core-dependencies/router'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import web3Factory from '../../refactor/web3/index'
import { removeWatchersUserMonitor } from '@chronobank/core-dependencies/redux/ui/actions'
import ProfileModel from '../../models/ProfileModel'
import { cbeWatcher, watcher } from '../watcher/actions'
import { watchStopMarket } from '../market/actions'
import { notify } from '../notifier/actions'
import { WEB3_SETUP } from '../web3/reducer'

export const DUCK_SESSION = 'session'

export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'

export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'
export const SET_PROFILE_SIGNATURE = 'session/SET_PROFILE_SIGNATURE'

export const DEFAULT_USER_URL = '/wallets'
export const DEFAULT_CBE_URL = '/wallets'

export const GAS_SLIDER_MULTIPLIER_CHANGE = 'session/GAS_SLIDER_MULTIPLIER_CHANGE'

export const CURRENT_PROFILE_VERSION = 1
export const PROFILE_PANEL_TOKENS = [
  { symbol: 'BTC', blockchain: 'Bitcoin', title: 'BTC' },
  { symbol: 'BCC', blockchain: 'Bitcoin Cash', title: 'BCC' },
  { symbol: 'BTG', blockchain: 'Bitcoin Gold', title: 'BTG' },
  { symbol: 'LTC', blockchain: 'Litecoin', title: 'LTC' },
  { symbol: 'ETH', blockchain: 'Ethereum', title: 'ETH' },
  { symbol: 'XEM', blockchain: 'NEM', title: 'NEM' },
  { symbol: 'WAVES', blockchain: 'WAVES', title: 'WAVES' },
]

export const createSession = ({ account, provider, network, dispatch }) => {
  ls.createSession(account, provider, network)
  dispatch({ type: SESSION_CREATE, account })
}

export const destroySession = ({ lastURL, dispatch }) => {
  ls.setLastURL(lastURL)
  ls.destroySession()
  dispatch({ type: SESSION_DESTROY })
}

export const logout = () => async (dispatch, getState) => {
  try {
    const { selectedNetworkId } = getState().get(DUCK_NETWORK)
    dispatch(removeWatchersUserMonitor())
    await dispatch(watchStopMarket())
    await networkService.destroyNetworkSession(`${window.location.pathname}${window.location.search}`)
    await dispatch(push('/'))
    if (selectedNetworkId === NETWORK_MAIN_ID) {
      location.reload()
    } else {
      await dispatch(bootstrap(false))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.warn('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  const { selectedNetworkId, selectedProviderId } = getState().get(DUCK_NETWORK)
  if (!getState().get(DUCK_SESSION).isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  const network = getNetworkById(selectedNetworkId, selectedProviderId)

  const web3 = typeof window !== 'undefined'
    ? web3Factory(network)
    : null

  dispatch({ type: WEB3_SETUP, web3 })

  await dispatch(watcher({ web3 }))

  const userManagerDAO = daoByType('UserManager')(getState())
  const [isCBE, profile, memberId] = await Promise.all([
    userManagerDAO.isCBE(account),
    userManagerDAO.getMemberProfile(account, web3),
    userManagerDAO.getMemberId(account),
  ])

  // @todo Need to refactor PendingManagerDAO
  // TODO @bshevchenko: PendingManagerDAO should receive member id from redux state
  // const pmDAO = await contractsManagerDAO.getPendingManagerDAO()
  // pmDAO.setMemberId(memberId)

  dispatch({ type: SESSION_PROFILE, profile, isCBE })

  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  isCBE && dispatch(cbeWatcher())
  dispatch(replace(ls.getLastURL() || defaultURL))
}

export const bootstrap = (relogin = true) => async (dispatch, getState) => {
  networkService.checkMetaMask()
  if (networkService) {
    networkService
      .on('createSession', createSession)
      .on('destroySession', destroySession)
      .on('login', ({ account, dispatch }) => dispatch(login(account)))
  }

  if (!relogin) {
    return
  }

  const localAccount = ls.getLocalAccount()
  const isPassed = await networkService.checkLocalSession(localAccount)
  if (isPassed) {
    await networkService.restoreLocalSession(localAccount, getState().get('ethMultisigWallet'))
    networkService.createNetworkSession(localAccount, LOCAL_PROVIDER_ID, LOCAL_ID)
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}

export const watchInitProfile = () => async (dispatch, getState) => {
  const userManagerDAO = daoByType('UserManager')(getState())
  return userManagerDAO.watchProfile((notice) => dispatch(notify(notice)))
}

export const setProfileSignature = (signature) => (dispatch) => {
  dispatch({ type: SET_PROFILE_SIGNATURE, signature })
}

export const getProfileSignature = (wallet) => async (dispatch) => {
  if (!wallet) {
    return
  }

  let signDataString = profileService.getSignData()

  let signData = wallet.sign(signDataString)

  let profileSignature = await profileService.getProfile(signData.signature)

  dispatch(setProfileSignature(profileSignature))

  return profileSignature
}

export const updateUserProfile = (profile) => async (dispatch, getState) => {
  const { profileSignature } = getState().get(DUCK_SESSION)

  const newProfile = await profileService.updateUserProfile({ ...profile }, profileSignature.token)

  dispatch(setProfileSignature({
    ...profileSignature,
    profile: newProfile,
  }))
}

export const uploadAvatar = (img) => (dispatch) => {
  const avatar = profileService.avatarUpload(img)
  console.log('avatar', avatar)

  return img
}
