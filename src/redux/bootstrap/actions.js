import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'

import NetworkService from '../network/actions'
import { login } from '../session/actions'

export const bootstrap = (relogin = true) => async (dispatch) => {
  dispatch(NetworkService.checkMetaMask())
  dispatch(NetworkService.checkTestRPC())

  if (!relogin) {
    return
  }

  const localAccount = ls.getLocalAccount()
  const isPassed = await dispatch(NetworkService.checkLocalSession(localAccount))
  if (isPassed) {
    await dispatch(NetworkService.restoreLocalSession(localAccount))
    dispatch(NetworkService.createNetworkSession(localAccount, LOCAL_ID, LOCAL_ID))
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}
