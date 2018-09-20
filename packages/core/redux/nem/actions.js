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

export const nemTxSignTransactionError = (error) => ({
  type: NemConstants.TX_SIGN_ERROR,
  error,
})

export const nemTxSendSignedTransaction = (entry) => ({
  type: NemConstants.TX_SEND_SIGNED_TX,
  entry,
})

export const nemTxSendSignedTransactionError = (error) => ({
  type: NemConstants.TX_SEND_SIGNED_TX_ERROR,
  error,
})

export const nemTxSignTransaction = (entry) => ({
  type: NemConstants.TX_SIGN,
  entry,
})

export const nemExecuteTx = (entry) => ({
  type: NemConstants.TX_EXECUTE,
  entry,
})

export const nemPrepareTx = (entry) => ({
  type: NemConstants.TX_PREPARE,
  entry,
})

export const nemProcessTx = (entry) => ({
  type: NemConstants.TX_PROCESS,
  entry,
})

export const nemSubmitTx = (entry) => ({
  type: NemConstants.TX_SUBMIT,
  entry,
})

export const nemRejectTx = (entry) => ({
  type: NemConstants.TX_REJECT,
  entry,
})
