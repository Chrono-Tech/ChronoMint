import networkService from '@chronobank/login/network/NetworkService'
import { LOCAL_ID, LOCAL_PROVIDER_ID, NETWORK_MAIN_ID } from '@chronobank/login/network/settings'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import contractsManagerDAO from 'dao/ContractsManagerDAO'
import ProfileModel from 'models/ProfileModel'
import { push, replace } from 'react-router-redux'
import { watchStopMarket } from 'redux/market/action'
import { removeWatchersUserMonitor } from 'redux/ui/actions'
import { cbeWatcher, watcher } from 'redux/watcher/actions'
import ls from 'utils/LocalStorage'
import { DEFAULT_TOKENS } from 'dao/ERC20ManagerDAO'

export const DUCK_SESSION = 'session'

export const SESSION_CREATE = 'session/CREATE'
export const SESSION_DESTROY = 'session/DESTROY'

export const SESSION_PROFILE = 'session/PROFILE'
export const SESSION_PROFILE_UPDATE = 'session/PROFILE_UPDATE'

export const DEFAULT_USER_URL = '/dashboard'
export const DEFAULT_CBE_URL = '/dashboard'

export const CURRENT_PROFILE_VERSION = 1

export const createSession = ({ account, provider, network, dispatch }) => {
  ls.createSession(account, provider, network)
  dispatch({ type: SESSION_CREATE, account })
}

export const destroySession = ({ lastURL, dispatch }) => {
  ls.setLastURL(lastURL)
  ls.destroySession()
  dispatch({ type: SESSION_DESTROY })
}

export const logout = () => async (dispatch, getState) => {
  try {
    const { selectedNetworkId } = getState().get(DUCK_NETWORK)
    dispatch(removeWatchersUserMonitor())
    await dispatch(watchStopMarket())
    await networkService.destroyNetworkSession(`${window.location.pathname}${window.location.search}`)
    await dispatch(push('/'))
    if (selectedNetworkId === NETWORK_MAIN_ID) {
      location.reload()
    } else {
      await dispatch(bootstrap(false))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.warn('logout error:', e)
  }
}

export const login = (account) => async (dispatch, getState) => {
  if (!getState().get(DUCK_SESSION).isSession) {
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

  dispatch(watcher())
  isCBE && dispatch(cbeWatcher())
  dispatch(replace((isCBE && ls.getLastURL()) || defaultURL))
}

export const bootstrap = (relogin = true) => async (dispatch) => {
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

  const localAccount = ls.getLocalAccount()
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
    await dao.setMemberProfile(account, newProfile.version(CURRENT_PROFILE_VERSION))
  } catch (e) {
    // eslint-disable-next-line
    console.error('update profile error', e.message)
    dispatch({ type: SESSION_PROFILE_UPDATE, profile })
  }
}

export const rebuildProfileTokens = (profile, tokens) => {
  let profileTokens = []

  if (profile.version() !== CURRENT_PROFILE_VERSION) {
    profile.tokens().toArray().map((item) => {
      if (!item) {                              // for null
        return
      }

      let token
      if (typeof item === 'string') {
        if (item.indexOf('/') + 1) {            // for 'Bitcoin/BTC'
          const [ , symbol ] = item.split('/')
          token = tokens.item(symbol)
        } else {                                // for 'address'
          token = tokens.getByAddress(item)
        }
      }

      if (item.symbol) {                        // for 'BTC'
        token = tokens.item(item.symbol)
      }

      token.isFetched() && profileTokens.push({
        address: token.address(),
        symbol: token.symbol(),
        blockchain: token.blockchain(),
        show: true,
      })

    })
  } else {
    profileTokens = profile.tokens().toArray()
  }

  const defaultTokens = DEFAULT_TOKENS.filter((symbol) => {
    let inIncluded = false
    profileTokens.map((profileToken) => {
      if (profileToken.symbol === symbol) {
        inIncluded = true
      }
    })
    return !inIncluded
  })

  defaultTokens.map((symbol) => {
    let token = tokens.item(symbol)

    token.isFetched() && profileTokens.push({
      address: token.address(),
      symbol: token.symbol(),
      blockchain: token.blockchain(),
      show: true,
    })
  })

  return profileTokens
}
