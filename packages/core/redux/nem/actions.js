/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TX_CREATE, TX_STATUS } from './constants'

export const nemTxCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const nemTxStatus = (key, address, props) => ({
  type: TX_STATUS,
  address,
  key,
  props,
})
