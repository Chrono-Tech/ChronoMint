/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ledger from './ledger/reducer'
import trezor from './trezor/reducer'

const loginReducers =  {
  ledger,
  trezor,
}

export default loginReducers
