/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import { TX_CREATE, TX_REMOVE, TX_UPDATE } from './constants'

const initialState = () => ({
  pending: {},
})

const mutations = {
  [TX_CREATE]: (state, { entry }) => {
    const address = entry.tx.from
    const pending = state.pending
    const scope = pending[address]
    return {
      ...state,
      pending: {
        ...pending,
        [address]: {
          ...scope,
          [entry.key]: entry,
        },
      },
    }
  },
  [TX_UPDATE]: (state, { key, address, tx }) => {
    const scope = state.pending[address]
    return {
      ...state,
      pending: {
        [address]: {
          ...scope,
          [key]: tx,
        },
      },
    }
  },
  [TX_REMOVE]: (state, { key, address }) => {
    const scope = state.pending[address]
    if (!scope || !scope[key]) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
}

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
