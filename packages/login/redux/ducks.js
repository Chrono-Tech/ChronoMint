/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { combineReducers } from 'redux-immutable'

import ledger from './ledger/reducer'
import monitor from './monitor/reducer'
import network from './network/reducer'
import trezor from './trezor/reducer'

const loginReducers =  {
  ledger,
  monitor,
  network,
  trezor,
}

export default loginReducers

// for further development
export const combinedLoginReducers = combineReducers(loginReducers)
