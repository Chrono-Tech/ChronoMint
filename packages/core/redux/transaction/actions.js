/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  TX_CREATE,
  TX_UPDATE,
} from './constants'

export const txCreate = (blockchain) => (entry) => ({
  type: TX_CREATE,
  blockchain,
  entry,
})

export const txUpdate = (blockchain) => (key, address, tx) => ({
  type: TX_UPDATE,
  address,
  blockchain,
  key,
  tx,
})
