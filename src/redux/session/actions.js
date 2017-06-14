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

export const logout = () => async (dispatch) => {
  try {
    await dispatch({
      type: SESSION_DESTROY,
      lastURL: `${window.location.pathname}${window.location.search}`
    })
    await dispatch(push('/login'))
    web3Provider.reset()
    return dispatch(bootstrap())
  } catch (e) {
    console.error('logout error:', e)
  }
}

export const login = (account) => async (dispatch) => {
  dispatch({type: SESSION_CREATE_FETCH})
  const dao = await ContractsManagerDAO.getUserManagerDAO()
  const [isCBE, profile] = await Promise.all([
    dao.isCBE(account),
    dao.getMemberProfile(account)
  ])
  const defaultURL = isCBE ? '/cbe' : '/profile'

  dispatch(loadUserProfile(profile))
  dispatch(watcher())
  isCBE && dispatch(cbeWatcher())
  dispatch({type: SESSION_CREATE, account, isCBE})
  dispatch(replace(LS.getLastURL() || defaultURL))
}

export const updateUserProfile = (profile: ProfileModel) => async (dispatch) => {
  dispatch({type: SESSION_PROFILE_FETCH})
  const dao = await ContractsManagerDAO.getUserManagerDAO()
  try {
    await dao.setMemberProfile(LS.getAccount(), profile)
    dispatch(loadUserProfile(profile))
  } catch (e) {
    dispatch(loadUserProfile(null))
  }
}
