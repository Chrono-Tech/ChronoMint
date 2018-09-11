/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as NemConstants from './constants'

export const nemTxCreate = (entry) => ({
  type: NemConstants.TX_CREATE,
  entry,
})

export const nemTxUpdate = (key, address, tx) => ({
  type: NemConstants.TX_UPDATE,
  address,
  key,
  tx,
})

export const nemTxRemove = (key, address) => ({
  type: NemConstants.TX_REMOVE,
  address,
  key,
})

export const nemTxAccept = (entry) => ({
  type: NemConstants.TX_ACCEPT,
  entry,
})

export const nemTxSignTransaction = (entry) => ({
  type: NemConstants.TX_SIGN,
  entry,
})
