/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TX_CREATE, TX_UPDATE, TX_REMOVE } from './constants'

export const nemTxCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const nemTxUpdate = (key, address, tx) => ({
  type: TX_UPDATE,
  address,
  key,
  tx,
})

export const nemTxRemove = (key, address) => ({
  type: TX_REMOVE,
  address,
  key,
})
