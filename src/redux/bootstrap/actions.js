import { checkMetaMask, checkAndRestoreLocalSession } from '../network/actions'

export const bootstrap = () => (dispatch) => {
  if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.location.protocol = 'https:'
    window.location.reload()
  }

  dispatch(checkMetaMask())
  // TODO @dkchv: may be split?
  return dispatch(checkAndRestoreLocalSession())
}
