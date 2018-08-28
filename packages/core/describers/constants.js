/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const EVENT_TYPE_TRANSACTION = 'transaction'
export const EVENT_TYPE_EVENT = 'event'

export const EVENT_TYPE = {
  event: {
    title: EVENT_TYPE_EVENT,
  },
  transaction: {
    title: EVENT_TYPE_TRANSACTION,
  },
}

// works only in rinkeby, default amount of TIME that could be required for test from contract
export const REQUIRED_TIME_AMOUNT = 1000000000
