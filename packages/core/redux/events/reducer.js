/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import LogListModel from '../../models/LogListModel'

import {
  LOGS_LOADING,
  LOGS_LOADED,
  LOGS_UPDATED,
} from './constants'

export const initialState = {
  history: {},
}

const mutations = {
  [LOGS_LOADING] (state, { address }) {
    address = address.toLowerCase()
    console.log('address: ', address)
    const history = state.history[address] || new LogListModel({ address })
    return {
      ...state.history,
      [address]: history.loading(),
    }
  },
  [LOGS_LOADED] (state, { address, cursor, entries }) {
    address = address.toLowerCase()
    const history = state.history[address] || new LogListModel({ address })
    return {
      ...state.history,
      [address]: history.loaded({
        entries,
        cursor,
      }),
    }
  },
  [LOGS_UPDATED] (state, { address, cursor, entries }) {
    address = address.toLowerCase()
    const history = state.history[address] || new LogListModel({ address })
    return {
      ...state.history,
      [address]: history.updated({
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
