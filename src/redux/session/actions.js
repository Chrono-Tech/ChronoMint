import { push, replace } from 'react-router-redux'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import networkService from '@chronobank/login/network/NetworkService'
import ProfileModel from 'models/ProfileModel'
import { cbeWatcher, watcher } from 'redux/watcher/actions'
import { initWallet } from 'redux/wallet/actions'
import { removeWatchersUserMonitor } from 'redux/ui/actions'
import { watchStopMarket } from 'redux/market/action'
import { WALLET_ADDRESS } from 'redux/mainWallet/actions'
import { LOCAL_ID, LOCAL_PROVIDER_ID } from '@chronobank/login/network/settings'

export const DUCK_SESSION = 'session'

export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'

export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'

export const DEFAULT_USER_URL = '/dashboard'
export const DEFAULT_CBE_URL = '/dashboard'

export const createSession = ({ account, provider, network, lastUrl, dispatch }) => {
  dispatch({ type: WALLET_ADDRESS, address: account })
  dispatch({ type: SESSION_CREATE, account, provider, network, lastUrl })
}

export const destroySession = ({ lastURL, dispatch }) => {
  dispatch({ type: SESSION_DESTROY, lastURL })
}

export const logout = () => async (dispatch) => {
  try {
    dispatch(removeWatchersUserMonitor())
    await dispatch(watchStopMarket())
    await networkService.destroyNetworkSession(`${window.location.pathname}${window.location.search}`)
    await dispatch(push('/'))
    await dispatch(bootstrap(false))
  } catch (e) {
    // eslint-disable-next-line
    console.warn('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  const state = getState()
  const session = state.get(DUCK_SESSION)
  if (!session.isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }

  const dao = await contractsManagerDAO.getUserManagerDAO()
  const [ isCBE, profile, memberId ] = await Promise.all([
    dao.isCBE(account),
    dao.getMemberProfile(account),
    dao.getMemberId(account),
  ])

  // TODO @bshevchenko: PendingManagerDAO should receive member id from redux state
  const pmDAO = await contractsManagerDAO.getPendingManagerDAO()
  pmDAO.setMemberId(memberId)

  dispatch({ type: SESSION_PROFILE, profile, isCBE })

  const defaultURL = isCBE ? DEFAULT_CBE_URL : DEFAULT_USER_URL
  dispatch(initWallet())
  dispatch(watcher())
  isCBE && dispatch(cbeWatcher())
  dispatch(replace((isCBE && session.lastURL) || defaultURL))
}

export const bootstrap = (relogin = true) => async (dispatch, getState) => {
  networkService.checkMetaMask()
  if (networkService) {
    networkService
      .on('createSession', createSession)
      .on('destroySession', destroySession)
      .on('login', ({ account, dispatch }) => dispatch(login(account)))
  }

  if (!relogin) {
    return
  }

  const state = getState()
  const session = state.get(DUCK_SESSION)

  const localAccount = session.account
  const isPassed = await networkService.checkLocalSession(localAccount)
  if (isPassed) {
    await networkService.restoreLocalSession(localAccount)
    networkService.createNetworkSession(localAccount, LOCAL_PROVIDER_ID, LOCAL_ID)
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}

export const updateUserProfile = (newProfile: ProfileModel) => async (dispatch, getState) => {
  const { isSession, account, profile } = getState().get(DUCK_SESSION)
  if (!isSession) {
    // setup and check network first and create session
    throw new Error('Session has not been created')
  }
  dispatch({ type: SESSION_PROFILE_UPDATE, profile: newProfile })
  try {
    const dao = await contractsManagerDAO.getUserManagerDAO()
    await dao.setMemberProfile(account, newProfile)
  } catch (e) {
    // eslint-disable-next-line
    console.error('update profile error', e.message)
    dispatch({ type: SESSION_PROFILE_UPDATE, profile })
  }
}
