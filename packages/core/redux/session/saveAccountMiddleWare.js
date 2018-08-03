/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import SessionStorage from '@chronobank/core-dependencies/utils/SessionStorage'
import { SESSION_CREATE } from './constants'

const saveAccountMiddleWare = (/*store*/) => (next) => (action) => {
  if (SESSION_CREATE === action.type && action.account) {
    SessionStorage.setAccount(action.account)
  }
  next(action)
}
export default saveAccountMiddleWare
