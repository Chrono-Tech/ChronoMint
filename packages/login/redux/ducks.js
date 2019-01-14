/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import monitor from './monitor/reducer'
import network from './network/reducer'

const loginReducers =  {
  monitor,
  network,
}

export default loginReducers

// for further development
export const combinedLoginReducers = combineReducers(loginReducers)
