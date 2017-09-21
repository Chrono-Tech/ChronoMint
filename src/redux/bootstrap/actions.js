import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'

import networkService from '../network/actions'
import { login } from '../session/actions'

export const bootstrap = (relogin = true) => async (dispatch) => {
  networkService.checkMetaMask()
  networkService.checkTestRPC()

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
