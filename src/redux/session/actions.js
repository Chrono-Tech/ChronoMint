import { push, replace } from 'react-router-redux'
import UserDAO from '../../dao/UserDAO'
import ProfileModel from '../../models/ProfileModel'
import { cbeWatcher, watcher } from '../watcher'
import web3Provider from '../../network/Web3Provider'
import LS from '../../dao/LocalStorageDAO'
import { bootstrap } from '../bootstrap/actions'

export const SESSION_CREATE_FETCH = 'session/CREATE_FETCH'
export const SESSION_CREATE = 'session/CREATE'
export const SESSION_PROFILE_FETCH = 'session/PROFILE_FETCH'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_DESTROY = 'session/DESTROY'

export const loadUserProfile = (profile: ProfileModel) => ({type: SESSION_PROFILE, profile})

export const logout = () => (dispatch) => {
  return Promise
    .resolve(dispatch({type: SESSION_DESTROY, lastUrl: `${window.location.pathname}${window.location.search}`}))
    .then(() => dispatch(push('/login')))
    .then(() => {
      web3Provider.reset()
      dispatch(bootstrap())
    })
    .catch(e => console.error(e))
}

export const login = (account, isInitial = false, isCBERoute = false) => (dispatch, getState) => {
  dispatch({type: SESSION_CREATE_FETCH})
  return Promise.all([
    UserDAO.isCBE(account),
    UserDAO.getMemberProfile(account)
  ]).then(([isCBE, profile]) => {
    const accounts = getState().get('network').accounts
    if (!accounts.includes(account)) {
      return dispatch(push('/login'))
    }

    dispatch(loadUserProfile(profile))
    dispatch({type: SESSION_CREATE, account, isCBE})

    if (!isInitial) {
      dispatch(watcher(account))
      if (isCBE) {
        dispatch(cbeWatcher(account))
      }
    }

    if (profile.isEmpty()) {
      return dispatch(push('/profile'))
    }

    if (isInitial) {
      const lastUrls = LS.getLastUrls() || {}
      const next = lastUrls[account]
      dispatch(replace(next || ('/' + ((!isCBE) ? '' : 'cbe'))))
    } else if (!isCBE && isCBERoute) {
      dispatch(replace('/'))
    }
  })
}

export const updateUserProfile = (profile: ProfileModel) => dispatch => {
  dispatch({type: SESSION_PROFILE_FETCH})
  dispatch(push('/'))
  return UserDAO.setMemberProfile(LS.getAccount(), profile).then(() => {
    dispatch(loadUserProfile(profile))
  }).catch(() => {
    dispatch(loadUserProfile(null))
  })
}
