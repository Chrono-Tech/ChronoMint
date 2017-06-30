import { push, replace } from 'react-router-redux'

import ProfileModel from '../../models/ProfileModel'

import contractsManagerDAO from '../../dao/ContractsManagerDAO'
import ls from '../../utils/LocalStorage'
import { cbeWatcher, watcher } from '../watcher'
import { bootstrap } from '../bootstrap/actions'
import { destroyNetworkSession } from '../network/actions'

export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'

export const SESSION_PROFILE_FETCH = 'session/PROFILE_FETCH'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'

export const DEFAULT_USER_URL = '/'
export const DEFAULT_CBE_URL = '/'

export const createSession = (account) => (dispatch) => {
  dispatch({type: SESSION_CREATE, account})
}

export const destroySession = () => (dispatch) => {
  dispatch({type: SESSION_DESTROY})
}

export const logout = () => async (dispatch) => {
  try {
    await dispatch(destroyNetworkSession(`${window.location.pathname}${window.location.search}`))
    await dispatch(push('/login'))
    await dispatch(bootstrap(false))
  } catch (e) {
    console.error('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  if (!getState().get('session').isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  dispatch({type: SESSION_PROFILE_FETCH})
  const dao = await contractsManagerDAO.getUserManagerDAO()
  const [isCBE, profile, memberId] = await Promise.all([
    dao.isCBE(account),
    dao.getMemberProfile(account),
    dao.getMemberId(account)
  ])

  // TODO @bshevchenko: PendingManagerDAO should receive member id from redux state
  const pmDAO = await contractsManagerDAO.getPendingManagerDAO()
  pmDAO.setMemberId(memberId)

  dispatch({type: SESSION_PROFILE, profile, isCBE})

  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  dispatch(watcher())
  isCBE && dispatch(cbeWatcher())
  dispatch(replace(ls.getLastURL() || defaultURL))
}

export const updateUserProfile = (profile: ProfileModel) => async (dispatch, getState) => {
  const {isSession, account} = getState().get('session')
  if (!isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  dispatch({type: SESSION_PROFILE_FETCH})
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.setMemberProfile(account, profile)
    dispatch({type: SESSION_PROFILE_UPDATE, profile})
  } catch (e) {
    console.error('update user profile error', e)
  }
}
