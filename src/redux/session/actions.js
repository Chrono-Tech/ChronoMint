import {push, replace} from 'react-router-redux'
import ChronoMintDAO from '../../dao/ChronoMintDAO'
import UserDAO from '../../dao/UserDAO'
import UserModel from '../../models/UserModel'
import {cbeWatcher} from '../watcher'

export const SESSION_CREATE_START = 'session/CREATE_START'
export const SESSION_CREATE_SUCCESS = 'session/CREATE_SUCCESS'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_DESTROY = 'session/DESTROY'

const createSessionStart = () => ({type: SESSION_CREATE_START})
const createSessionSuccess = (account, isCBE) => ({type: SESSION_CREATE_SUCCESS, account, isCBE})
const loadUserProfile = (profile: UserModel) => ({type: SESSION_PROFILE, profile})
const destroySession = (lastUrl) => ({type: SESSION_DESTROY, lastUrl})

const login = (account, isInitial = false, isCBERoute = false) => dispatch => {
  dispatch(createSessionStart())
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

    if (isCBE && !isInitial) {
      dispatch(cbeWatcher(account))
    }

    if (profile.isEmpty()) {
      return dispatch(push('/profile'))
    }

    if (isInitial) {
      const next = JSON.parse(window.localStorage.getItem('lastUrls') || '{}')[account]
      console.log(isCBE)
      dispatch(replace(next || ('/' + ((!isCBE) ? '' : 'cbe'))))
    } else if (!isCBE && isCBERoute) {
      dispatch(replace('/'))
    }
  })
}

const updateUserProfile = (profile: UserModel, account) => dispatch => {
  return UserDAO.setMemberProfile(account, profile).then(() => {
    dispatch(loadUserProfile(profile))
    return dispatch(push('/'))
  })
}

const logout = () => (dispatch) => {
  return Promise.resolve(dispatch(destroySession(`${window.location.pathname}${window.location.search}`)))
    .then(() => dispatch(push('/login')))
}

export {
  createSessionStart,
  createSessionSuccess,
  destroySession,
  loadUserProfile,
  login,
  updateUserProfile,
  logout
}
