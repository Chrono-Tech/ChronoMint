import * as tokens from './lib/tokenEventDescribers'
import * as asset from './lib/assetEventDescribers'

export * from './EventDescriber'

export const EVENT_DESCRIBERS = [
  ...Object.values(tokens),
  ...Object.values(asset),
]

export const EVENT_DESCRIBERS_BY_TOPIC = EVENT_DESCRIBERS.reduce(
  (target, describer) => {
    const array = target[describer.topic] = target[describer.topic] || []
    array.push(describer)
    return target
  },
  {},
)
