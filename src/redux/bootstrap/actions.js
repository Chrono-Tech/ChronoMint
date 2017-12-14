import { LOCAL_ID, LOCAL_PROVIDER_ID } from '@chronobank/login/network/settings'
import ls from 'utils/LocalStorage'
import networkService from '@chronobank/login/network/NetworkService'
import { login, createSession, destroySession } from 'redux/session/actions'

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
