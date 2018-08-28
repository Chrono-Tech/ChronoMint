/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as BitcoinConstants from './constants'

export const createTransaction = (entry) => ({
  type: BitcoinConstants.TX_CREATE,
  entry,
})

export const acceptTransaction = (entry) => ({
  type: BitcoinConstants.TX_STATUS,
  key: entry.key,
  address: entry.tx.from,
  props: {
    isAccepted: true,
    isPending: true,
  },
})

export const rejectTransaction = (entry) => ({
  type: BitcoinConstants.TX_STATUS,
  key: entry.key,
  address: entry.tx.from,
  props: {
    isRejected: true,
  },
})
