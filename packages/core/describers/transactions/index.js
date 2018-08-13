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
