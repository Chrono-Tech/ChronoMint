/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { SESSION_CREATE } from 'redux/session/actions'
import SessionStorage from 'utils/SessionStorage'

const saveAccountMiddleWare = (/*store*/) => next => action => {
  console.log('saveAccountMiddleWare: ', action)
  if (SESSION_CREATE === action.type && action.account) {
    SessionStorage.setAccount(action.account)
  }
  next(action)
}
export default saveAccountMiddleWare
