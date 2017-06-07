import { push, replace } from 'react-router-redux'
import ContractsManagerDAO from '../../dao/ContractsManagerDAO'
import ProfileModel from '../../models/ProfileModel'
import { cbeWatcher, watcher } from '../watcher'
import web3Provider from '../../network/Web3Provider'
import LS from '../../utils/LocalStorage'
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
      return dispatch(bootstrap())
    })
    .catch(e => console.error(e))
}

export const login = (account, isInitial = false, isCBERoute = false) => async (dispatch, getState) => {
  dispatch({type: SESSION_CREATE_FETCH})
  const dao = await ContractsManagerDAO.getUserManagerDAO()

  const [isCBE, profile] = await Promise.all([
    dao.isCBE(account),
    dao.getMemberProfile(account)
  ])

  const accounts = getState().get('network').accounts
  if (!accounts.includes(account)) {
    return dispatch(push('/login'))
  }

  dispatch(loadUserProfile(profile))

  if (!isInitial) {
    dispatch(watcher())
    if (isCBE) {
      dispatch(cbeWatcher())
    }
  }

  dispatch({type: SESSION_CREATE, account, isCBE})

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
}

export const updateUserProfile = (profile: ProfileModel) => async (dispatch) => {
  dispatch({type: SESSION_PROFILE_FETCH})
  dispatch(push('/'))
  const dao = await ContractsManagerDAO.getUserManagerDAO()
  return dao.setMemberProfile(LS.getAccount(), profile).then(() => {
    dispatch(loadUserProfile(profile))
  }).catch(() => {
    dispatch(loadUserProfile(null))
  })
}
