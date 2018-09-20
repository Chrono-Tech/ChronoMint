/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getWeb3Instance } from '@chronobank/nodes/redux/actions'
// import * as PersistAccountActions from '@chronobank/core/redux/persistAccount/actions'
import { daoByType } from '../../redux/daos/selectors'
import { DEFAULT_CBE_URL, DEFAULT_USER_URL, DUCK_SESSION } from './constants'
import { initEthereum } from '../ethereum/thunks'
import { watcher } from '../watcher/actions'
import { watchStopMarket } from '../market/actions'
import * as ProfileThunks from '../profile/thunks'
import * as SessionActions from './actions'
import ProfileService from '../profile/service'

export const createNetworkSession = (account) => (dispatch) => {
  if (!account) {
    throw new Error(`Wrong session arguments: account: ${account}`)
  }

  // dispatch(PersistAccountActions.accountSelect(account))
  dispatch(SessionActions.sessionCreate(account))
}

export const logout = () => async (dispatch) => {
  try {
    dispatch(watchStopMarket())
    // dispatch(destroyNetworkSession())
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  const state = getState()

  if (!state.get(DUCK_SESSION).isSession) {
    throw new Error('Session has not been created')
  }

  // TODO: to rework workign with custom networks
  // if (!network.id) {
  //   network = customNetworksList.find((network) => network.id === selectedNetworkId)
  // }

  const web3 = typeof window !== 'undefined'
    ? await dispatch(getWeb3Instance())
    : null

  await dispatch(initEthereum({ web3 }))
  await dispatch(watcher({ web3 }))

  const userManagerDAO = daoByType('UserManager')(getState())
  const [isCBE, profile /*memberId*/] = await Promise.all([
    userManagerDAO.isCBE(account),
    userManagerDAO.getMemberProfile(account, web3),
    userManagerDAO.getMemberId(account),
  ])

  dispatch(SessionActions.sessionProfile(profile, isCBE))
  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  return defaultURL
}

export const getProfileSignature = (signer, path) => async (dispatch) => {
  if (!signer) {
    return
  }

  try {
    const signDataString = ProfileService.getSignData()
    const signData = await signer.signData(signDataString, path)
    const profileSignature = await dispatch(ProfileThunks.getUserProfile(signData.signature))
    dispatch(SessionActions.setProfileSignature(profileSignature))

    return profileSignature
  } catch (error) {
    // TODO: to handle it in appropriate way
    // eslint-disable-next-line no-console
    console.warn('getProfileSignature error: ', error)
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
