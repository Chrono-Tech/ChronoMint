import { LOCAL_ID } from 'Login/network/settings'
import ls from 'utils/LocalStorage'
import networkService from 'Login/redux/network/actions'
import {login, createSession, destroySession} from 'redux/session/actions'

export const bootstrap = (relogin = true) => async dispatch => {
  networkService.checkMetaMask()
  networkService.checkTestRPC()
  if (networkService) {
    networkService
      .on('createSession', createSession)
      .on('destroySession', destroySession)
      .on('login', ({account, dispatch}) => dispatch(login(account)))
  }

  if (!relogin) {
    return
  }

  const localAccount = ls.getLocalAccount()
  const isPassed = await networkService.checkLocalSession(localAccount)
  if (isPassed) {
    await networkService.restoreLocalSession(localAccount)
    networkService.createNetworkSession(localAccount, LOCAL_ID, LOCAL_ID)
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}
