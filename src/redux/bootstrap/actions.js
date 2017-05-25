import { checkMetaMask, checkTestRPC, clearTestRPCState, restoreTestRPCState } from '../network/actions'
import LS from '../../utils/LocalStorage'
import { LOCAL_ID } from '../../network/settings'

export const bootstrap = () => dispatch => {
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.location.protocol = 'https:'
    window.location.reload()
  }

  dispatch(checkMetaMask())

  return dispatch(checkTestRPC()).then(isTestRPC => {
    const account = LS.getAccount()
    const provider = LS.getWeb3Provider()
    if (isTestRPC && account && provider === LOCAL_ID) {
      dispatch(restoreTestRPCState(account))
    } else {
      dispatch(clearTestRPCState())
    }
  })
}
