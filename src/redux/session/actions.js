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
const destroySession = (next) => ({type: SESSION_DESTROY, next})

const login = (account, isInitial = false) => dispatch => {
  dispatch(createSessionStart())
  return Promise.all([
    UserDAO.isCBE(account),
    UserDAO.getMemberProfile(account)
  ]).then(values => {
    const isCBE = values[0]

    /** @type UserModel */
    const profile = values[1]

    if (!isCBE && !ChronoMintDAO.web3.eth.accounts.includes(account)) {
      return dispatch(push('/login'))
    }

    dispatch(loadUserProfile(profile))
    dispatch(createSessionSuccess(account, isCBE))

    if (isCBE) {
      dispatch(cbeWatcher(account))
    }

    if (profile.isEmpty()) {
      return dispatch(push('/profile'))
    }

    if (isInitial || !isCBE) { // TODO MINT-108 Non-CBE user should not always start from /wallet route
      const next = window.localStorage.getItem('next')
      window.localStorage.removeItem('next')
      dispatch(replace(next || ('/' + (!isCBE ? 'wallet' : ''))))
    }
  })
}

const goToHomePage = (account) => dispatch => {
  return UserDAO.isCBE(account).then(isCBE => {
    return isCBE
      ? dispatch(push('/'))
      : dispatch(push('/wallet'))
  })
}

const updateUserProfile = (profile: UserModel, account) => dispatch => {
  return UserDAO.setMemberProfile(account, profile).then(() => {
    dispatch(loadUserProfile(profile))
    return dispatch(goToHomePage(account))
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
  goToHomePage,
  updateUserProfile,
  logout
}
