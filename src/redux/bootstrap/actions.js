import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'

import {
  checkMetaMask, checkLocalSession, restoreLocalSession, createNetworkSession,
  checkTestRPC
} from '../network/actions'
import { login } from '../session/actions'

export const bootstrap = (relogin = true) => async (dispatch) => {
  dispatch(checkMetaMask())
  dispatch(checkTestRPC())

  if (!relogin) {
    return
  }

  const localAccount = ls.getLocalAccount()
  const isPassed = await dispatch(checkLocalSession(localAccount))
  if (isPassed) {
    await dispatch(restoreLocalSession(localAccount))
    dispatch(createNetworkSession(localAccount, LOCAL_ID, LOCAL_ID))
    dispatch(login(localAccount))
  } else {
    // eslint-disable-next-line
    console.warn('Can\'t restore local session')
  }
}
