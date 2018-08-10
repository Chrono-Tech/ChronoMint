/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import LogListModel from '../../models/LogListModel'

export const eventsSelector = () => (state) => state.get('events')

export const eventsByAddress = (address: string) => createSelector(
  eventsSelector(),
  (history) => {
    return history[address.toLowerCase()] || new LogListModel({ address: address.toLowerCase() })
  },
)
