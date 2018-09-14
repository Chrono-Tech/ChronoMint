/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesConstants from './constants'

export const wavesTxCreate = (entry) => ({
  type: WavesConstants.TX_CREATE,
  entry,
})

export const wavesTxUpdate = (key, address, tx) => ({
  type: WavesConstants.TX_UPDATE,
  address,
  key,
  tx,
})

export const wavesTxRemove = (key, address) => ({
  type: WavesConstants.TX_REMOVE,
  address,
  key,
})

export const wavesTxAccept = (entry) => ({
  type: WavesConstants.TX_ACCEPT,
  entry,
})

export const wavesTxReject = (entry) => ({
  type: WavesConstants.TX_REJECT,
  entry,
})

export const wavesTxSignTransaction = (entry) => ({
  type: WavesConstants.TX_SIGN,
  entry,
})

export const wavesTxSignTransactionError = (error) => ({
  type: WavesConstants.TX_SIGN_ERROR,
  error,
})

export const wavesTxProcessTransaction = (entry) => ({
  type: WavesConstants.TX_PROCESS,
  entry,
})
