import * as tokens from './lib/tokenEventDescribers'

export * from './EventDescriber'

export const EVENT_DESCRIBERS = [
  ...Object.values(tokens),
]

export const EVENT_DESCRIBERS_BY_TOPIC = EVENT_DESCRIBERS.reduce(
  (target, describer) => {
    const array = target[describer.topic] = target[describer.topic] || []
    array.push(describer)
    return target
  },
  {},
)
