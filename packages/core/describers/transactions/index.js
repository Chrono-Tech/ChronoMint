import * as tokens from './lib/tokenTxDescribers'
import * as deposit from './lib/depositTxDescribers'
import * as voting from './lib/votingTxDescribers'

export * from './TransactionDescriber'

export const TRANSACTION_DESCRIBERS = [
  ...Object.values(tokens),
  ...Object.values(deposit),
  ...Object.values(voting),
]

export const TRANSACTION_DESCRIBERS_BY_TOPIC = TRANSACTION_DESCRIBERS.reduce(
  (target, describer) => {
    const array = target[describer.topic] = target[describer.topic] || []
    array.push(describer)
    return target
  },
  {},
)
