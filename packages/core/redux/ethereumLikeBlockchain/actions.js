/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  NONCE_UPDATE,
  TX_CREATE,
  TX_UPDATE,
} from './constants'

export const nonceUpdate = (address, nonce) => ({
  type: NONCE_UPDATE,
  address,
  nonce,
})

export const txCreate = (entry) => ({
  type: TX_CREATE,
  entry,
})

export const txUpdate = (key, address, tx) => ({
  type: TX_UPDATE,
  address,
  key,
  tx,
})
