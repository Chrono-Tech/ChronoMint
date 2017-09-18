import { push, replace } from 'react-router-redux'
import ProfileModel from 'models/ProfileModel'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ls from 'utils/LocalStorage'
import { cbeWatcher, watcher } from 'redux/watcher/actions'
import { bootstrap } from 'redux/bootstrap/actions'
import { destroyNetworkSession } from 'redux/network/actions'
import { watchStopMarket } from 'redux/market/action'
import { removeWatchersUserMonitor } from 'redux/userMonitor/actions'

export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'

export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'

export const DEFAULT_USER_URL = '/wallet'
export const DEFAULT_CBE_URL = '/wallet'

export const createSession = (account) => (dispatch) => {
  dispatch({type: SESSION_CREATE, account})
}

export const destroySession = () => (dispatch) => {
  dispatch({type: SESSION_DESTROY})
}

export const logout = () => async (dispatch) => {
  try {
    dispatch(removeWatchersUserMonitor())
    await dispatch(watchStopMarket())
    await dispatch(destroyNetworkSession(`${window.location.pathname}${window.location.search}`))
    await dispatch(push('/'))
    await dispatch(bootstrap(false))
  } catch (e) {
    // eslint-disable-next-line
    console.warn('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  if (!getState().get('session').isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

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

export const updateUserProfile = (newProfile: ProfileModel) => async (dispatch, getState) => {
  const {isSession, account, profile} = getState().get('session')
  if (!isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  dispatch({type: SESSION_PROFILE_UPDATE, profile: newProfile})
  const dao = await contractsManagerDAO.getUserManagerDAO()
  try {
    await dao.setMemberProfile(account, newProfile)
  } catch (e) {
    dispatch({type: SESSION_PROFILE_UPDATE, profile})
  }
}
