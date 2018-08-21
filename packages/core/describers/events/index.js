/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as asset from './lib/assetEventDescribers'

export * from './EventDescriber'

export const EVENT_DESCRIBERS = [
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
