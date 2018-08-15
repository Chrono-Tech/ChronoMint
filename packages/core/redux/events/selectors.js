/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import LogListModel from '../../models/LogListModel'
import { getAccount } from '../../redux/session/selectors'

export const eventsSelector = () => (state) => state.get('events')

export const currentAccountEvents = () => createSelector(
  [
    eventsSelector(),
    getAccount,
  ],
  (history, account) => {
    return history[account] || new LogListModel({ address: account })
  },
)
