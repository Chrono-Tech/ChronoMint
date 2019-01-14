/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import LogListModel from '../../models/LogListModel'
import { getAccount } from '../../redux/session/selectors'

export const eventsSelector = () => (state) => state.get('events')

export const getHistoryEvents = (historyKey) => createSelector(
  [
    eventsSelector(),
    getAccount,
  ],
  (history, account) => {
    return history[historyKey] || new LogListModel({ address: account })
  },
)
