/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as eventDescribers from './events/lib/assetEventDescribers'

export const ASSET_TOPICS = Object.entries(eventDescribers).reduce((describers, [, describer]) => {
  describers.push(describer.topic)
  return describers
}, [])
