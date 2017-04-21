import { push, replace } from 'react-router-redux'
import UserDAO from '../../dao/UserDAO'
import UserModel from '../../models/UserModel'
import { cbeWatcher, watcher } from '../watcher'
import { transactionStart } from '../notifier/notifier'
import web3Provider from '../../network/Web3Provider'
import ls from '../../utils/localStorage'
import localStorageKeys from '../../constants/localStorageKeys'
import { checkMetaMask, checkTestRPC } from '../network/networkAction'

export const SESSION_CREATE_FETCH = 'session/CREATE_FETCH'
export const SESSION_CREATE = 'session/CREATE'
export const SESSION_PROFILE_FETCH = 'session/PROFILE_FETCH'
export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_DESTROY = 'session/DESTROY'

const createSessionSuccess = (account, isCBE) => ({type: SESSION_CREATE, account, isCBE})
const loadUserProfile = (profile: UserModel) => ({type: SESSION_PROFILE, profile})
const destroySession = (lastUrl) => ({type: SESSION_DESTROY, lastUrl})

const logout = () => (dispatch) => {
  return Promise.resolve(dispatch(destroySession(`${window.location.pathname}${window.location.search}`)))
    .then(() => dispatch(push('/login')))
    .then(() => {
      web3Provider.reset()
      dispatch(checkMetaMask())
      dispatch(checkTestRPC())
    })
}

const login = (account, isInitial = false, isCBERoute = false) => (dispatch) => {
  dispatch({type: SESSION_CREATE_FETCH})
  return Promise.all([
    UserDAO.isCBE(account),
    UserDAO.getMemberProfile(account),
    web3Provider.getWeb3()
  ]).then(([isCBE, profile, web3]) => {
    const callback = (error, accounts) => {
      if (error || !accounts.includes(account)) {
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
        const lastUrls = ls(localStorageKeys.LAST_URLS) || {}
        const next = lastUrls[account]
        dispatch(replace(next || ('/' + ((!isCBE) ? '' : 'cbe'))))
      } else if (!isCBE && isCBERoute) {
        dispatch(replace('/'))
      }
    }

    return new Promise((resolve) => {
      web3.eth.getAccounts((error, accounts) => {
        resolve(callback(error, accounts))
      })
    })
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

export {
  createSessionSuccess,
  destroySession,
  loadUserProfile,
  login,
  updateUserProfile,
  logout
}
