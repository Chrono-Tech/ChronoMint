import { checkMetaMask, checkTestRPC } from '../network/actions'
import LS from '../../dao/LocalStorageDAO'
import injectTapEventPlugin from 'react-tap-event-plugin'

export const bootstrap = () => dispatch => {
  // avoid relogin
  LS.setWeb3Provider(null)
  LS.setNetworkId(null)
  LS.setAccount(null)
  // checks
  dispatch(checkMetaMask())
  dispatch(checkTestRPC())

  injectTapEventPlugin()

  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.location.protocol = 'https:'
    window.location.reload()
  }
}
