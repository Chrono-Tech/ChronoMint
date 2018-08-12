/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import networkService from '@chronobank/login/network/NetworkService'
import { getNetworkById, LOCAL_ID, LOCAL_PROVIDER_ID, NETWORK_MAIN_ID } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { push, replace } from '@chronobank/core-dependencies/router'
import ls from '@chronobank/core-dependencies/utils/LocalStorage'
import { removeWatchersUserMonitor } from '@chronobank/core-dependencies/redux/ui/actions'
import * as SessionActions from './actions'
import * as ProfileThunks from '../profile/thunks'
import ProfileService from '../profile/service'
import { daoByType } from '../../redux/daos/selectors'
import web3Factory from '../../web3/index'
import { cbeWatcher, watcher } from '../watcher/actions'
import { watchStopMarket } from '../market/actions'
import { initEthereum } from '../ethereum/actions'
import {
  DUCK_PERSIST_ACCOUNT,
} from '../persistAccount/constants'
import {
  DEFAULT_CBE_URL,
  DEFAULT_USER_URL,
  DUCK_SESSION,
} from './constants'

export const changeGasSlideValue = (value, blockchain) => (dispatch) =>
  dispatch(SessionActions.gasSliderMultiplierChange(value, blockchain))

export const createSession = ({ account, provider, network, dispatch }) => {
  ls.createSession(account, provider, network)
  dispatch(SessionActions.sessionCreate(account))
}

export const destroySession = ({ lastURL, dispatch }) => {
  ls.setLastURL(lastURL)
  ls.destroySession()
  dispatch(SessionActions.sessionDestroy())
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
  const [isCBE, profile /*memberId*/] = await Promise.all([
    userManagerDAO.isCBE(account),
    userManagerDAO.getMemberProfile(account, web3),
    userManagerDAO.getMemberId(account),
  ])

  // @todo Need to refactor PendingManagerDAO
  // TODO @bshevchenko: PendingManagerDAO should receive member id from redux state
  // const pmDAO = await contractsManagerDAO.getPendingManagerDAO()
  // pmDAO.setMemberId(memberId)

  dispatch(SessionActions.sessionProfile(profile, isCBE))

  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  isCBE && dispatch(cbeWatcher())

  dispatch(replace(ls.getLastURL() || defaultURL))
}

export const bootstrap = (relogin = true, isMetaMaskRequired = true, isLocalAccountRequired = true) => async (dispatch, getState) => {
  if (isMetaMaskRequired) {
    networkService.checkMetaMask()
  }
  if (networkService) {
    networkService
      .on('createSession', createSession)
      .on('destroySession', destroySession)
      .on('login', ({ account, dispatch }) => dispatch(login(account)))
  }

  if (!relogin) {
    return networkService
  }

  if (isLocalAccountRequired) {
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

  return networkService
}

export const getProfileSignature = (wallet) => async (dispatch) => {
  if (!wallet) {
    return
  }
  try {
    const signDataString = ProfileService.getSignData()
    const signData = wallet.sign(signDataString)
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
