import { checkMetaMask, checkLocalSession, restoreLocalSession, createNetworkSession } from '../network/actions'
import LS from '../../utils/LocalStorage'
import { login } from '../session/actions'
import { LOCAL_ID } from '../../network/settings'

export const bootstrap = (relogin = true) => async (dispatch) => {
  // TODO @dkchv: research for new fix
  // if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
  //   window.location.protocol = 'https:'
  //   window.location.reload()
  // }

  dispatch(checkMetaMask())

  if (!relogin) {
    return
  }

  const localAccount = LS.getLocalAccount()
  const isPassed = await dispatch(checkLocalSession(localAccount))
  if (isPassed) {
    dispatch(restoreLocalSession(localAccount))
    dispatch(createNetworkSession(localAccount, LOCAL_ID, LOCAL_ID))
    dispatch(login(localAccount))
  } else {
    console.warn('Can\'t restore local session')
  }
}
