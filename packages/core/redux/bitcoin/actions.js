/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as BitcoinConstants from './constants'

export const bitcoinTxUpdate = (entry) => ({
  type: BitcoinConstants.TX_UPDATE,
  key: entry.key,
  address: entry.tx.from,
  entry,
})

export const createTransaction = (entry) =>
  bitcoinTxUpdate(entry)

export const acceptTransaction = (entry) =>
  bitcoinTxUpdate({ ...entry, isAccepted: true, isPending: true })

export const rejectTransaction = (entry) =>
  bitcoinTxUpdate({ ...entry, isRejected: true })
