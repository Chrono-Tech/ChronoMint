import { SESSION_CREATE } from 'redux/session/actions'
import { ss } from 'platform'

const saveAccountMiddleWare = (/*store*/) => next => action => {
  if (SESSION_CREATE === action.type && action.account) {
    ss.setAccount(action.account)
  }
  next(action)
}
export default saveAccountMiddleWare
