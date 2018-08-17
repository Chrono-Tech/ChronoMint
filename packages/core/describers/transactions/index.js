/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as tokens from './lib/tokenTxDescribers'

export * from './TransactionDescriber'

export const TRANSACTION_DESCRIBERS = [
  ...Object.values(tokens),
]

export const TRANSACTION_DESCRIBERS_BY_TOPIC = TRANSACTION_DESCRIBERS.reduce(
  (target, describer) => {
    const array = target[describer.topic] = target[describer.topic] || []
    array.push(describer)
    return target
  },
  {},
)
