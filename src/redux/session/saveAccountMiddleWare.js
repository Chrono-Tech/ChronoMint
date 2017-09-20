import { SESSION_CREATE } from 'redux/session/actions'
import SessionStorage from 'utils/SessionStorage'

const saveAccountMiddleWare = (/*store*/) => next => action => {
  if (SESSION_CREATE === action.type && action.account) {
    SessionStorage.setAccount(action.account)
  }
  next(action)
}
export default saveAccountMiddleWare
