/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as ledger from './ledger/'
import * as trezor from './trezor/'
import * as network from './network/'
import * as monitor from './monitor/'

export default {
  network,
  monitor,
  ledger,
  trezor,
}
