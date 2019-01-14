/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import LogListModel from '../../models/LogListModel'

import {
  EVENTS_LOGS_LOADING,
  EVENTS_LOGS_LOADED,
  EVENTS_LOGS_UPDATED,
} from './constants'

export const initialState = {}

const mutations = {
  [EVENTS_LOGS_LOADING] (state, { address, historyKey, topics }) {
    address = address.toLowerCase()
    const history = state[historyKey] || new LogListModel({ address, topics, historyKey })
    return {
      ...state,
      [historyKey]: history.loading(),
    }
  },
  [EVENTS_LOGS_LOADED] (state, { address, historyKey, cursor, entries }) {
    address = address.toLowerCase()
    const history = state[historyKey] || new LogListModel({ address })
    return {
      ...state,
      [historyKey]: history.loaded({
        entries,
        cursor,
      }),
    }
  },
  [EVENTS_LOGS_UPDATED] (state, { address, historyKey, cursor, entries }) {
    address = address.toLowerCase()
    const history = state[historyKey] || new LogListModel({ address })
    return {
      ...state,
      [historyKey]: history.updated({
        entries,
        cursor,
      }),
    }
  },
}

export default (state = initialState, { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
