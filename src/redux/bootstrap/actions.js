import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'

import NetworkService from '../network/actions'
import { login } from '../session/actions'

export const bootstrap = (relogin = true) => async (dispatch) => {
  NetworkService.checkMetaMask()
  NetworkService.checkTestRPC()

  if (!relogin) {
    return
  }

  const localAccount = ls.getLocalAccount()
  const isPassed = await NetworkService.checkLocalSession(localAccount)
  if (isPassed) {
    await NetworkService.restoreLocalSession(localAccount)
    NetworkService.createNetworkSession(localAccount, LOCAL_ID, LOCAL_ID)
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}
