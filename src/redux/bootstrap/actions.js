import { checkMetaMask, checkTestRPC } from '../network/actions'
import ls from '../../utils/localStorage'
import localStorageKeys from '../../constants/localStorageKeys'
import injectTapEventPlugin from 'react-tap-event-plugin'

export const bootstrap = () => dispatch => {
  // avoid relogin
  ls.remove(localStorageKeys.WEB3_PROVIDER)
  ls.remove(localStorageKeys.NETWORK_ID)
  ls.remove(localStorageKeys.account)
  // checks
  dispatch(checkMetaMask())
  dispatch(checkTestRPC())

  injectTapEventPlugin()

  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.location.protocol = 'https:'
    window.location.reload()
  }
}
