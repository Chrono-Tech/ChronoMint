/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as tokens from './lib/tokenTxDescribers'
import * as deposit from './lib/depositTxDescribers'
import * as voting from './lib/votingTxDescribers'
import * as assets from './lib/assetsTxDescribers'
import * as swaps from './lib/atomicSwapERC20Describers'
import * as timeHolderLX from './lib/timeHolderDescribers'

export * from './TransactionDescriber'

export const TRANSACTION_DESCRIBERS = [
  ...Object.values(tokens),
  ...Object.values(deposit),
  ...Object.values(voting),
  ...Object.values(assets),
  ...Object.values(swaps),
  ...Object.values(timeHolderLX),
]

export const TRANSACTION_DESCRIBERS_BY_TOPIC = TRANSACTION_DESCRIBERS.reduce(
  (target, describer) => {
    const array = target[describer.topic] = target[describer.topic] || []
    array.push(describer)
    return target
  },
  {},
)
