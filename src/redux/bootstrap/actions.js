import ls from 'utils/LocalStorage'
import { LOCAL_ID } from 'network/settings'

import {
  checkMetaMask, checkLocalSession, restoreLocalSession, createNetworkSession,
  checkTestRPC
} from '../network/actions'
import { login } from '../session/actions'

export const bootstrap = (relogin = true) => async (dispatch) => {
  // TODO @dkchv: research for new fix
  // if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  //   window.location.protocol = 'https:'
  //   window.location.reload()
  // }

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
