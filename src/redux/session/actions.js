import { push, replace } from 'react-router-redux'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import UserDAO from '../../dao/UserDAO'
import UserModel from '../../models/UserModel'
import { cbeWatcher, watcher } from '../watcher'
import { transactionStart } from '../notifier/notifier'

export const SESSION_CREATE_FETCH = 'session/CREATE_FETCH'
export const SESSION_CREATE = 'session/CREATE'
export const SESSION_PROFILE_FETCH = 'session/PROFILE_FETCH'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_DESTROY = 'session/DESTROY'

const createSessionSuccess = (account, isCBE) => ({type: SESSION_CREATE, account, isCBE})
const loadUserProfile = (profile: UserModel) => ({type: SESSION_PROFILE, profile})
const destroySession = (lastUrl) => ({type: SESSION_DESTROY, lastUrl})

const login = (account, isInitial = false, isCBERoute = false) => dispatch => {
  dispatch({type: SESSION_CREATE_FETCH})
  return Promise.all([
    UserDAO.isCBE(account),
    UserDAO.getMemberProfile(account)
  ]).then(values => {
    const isCBE = values[0]

    /** @type UserModel */
    const profile = values[1]

    if (!ChronoMintDAO.web3.eth.accounts.includes(account)) {
      return dispatch(push('/login'))
    }

    dispatch(loadUserProfile(profile))
    dispatch(createSessionSuccess(account, isCBE))

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
      const next = JSON.parse(window.localStorage.getItem('lastUrls') || '{}')[account]
      dispatch(replace(next || ('/' + ((!isCBE) ? '' : 'cbe'))))
    } else if (!isCBE && isCBERoute) {
      dispatch(replace('/'))
    }
  })
}

const updateUserProfile = (profile: UserModel, account) => dispatch => {
  dispatch(transactionStart())
  dispatch({type: SESSION_PROFILE_FETCH})
  dispatch(push('/'))
  return UserDAO.setMemberProfile(account, profile).then(() => {
    dispatch(loadUserProfile(profile))
  }).catch(() => {
    dispatch(loadUserProfile(null))
  })
}

const logout = () => (dispatch) => {
  return Promise.resolve(dispatch(destroySession(`${window.location.pathname}${window.location.search}`)))
    .then(() => dispatch(push('/login')))
}

export {
  createSessionSuccess,
  destroySession,
  loadUserProfile,
  login,
  updateUserProfile,
  logout
}
