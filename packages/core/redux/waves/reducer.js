/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import * as WavesConstants from './constants'

const initialState = () => ({
  lastRequestMeta: null,
  pending: {},
})

const mutations = {
  [WavesConstants.TX_CREATE]: (state, { entry }) => {
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
  [WavesConstants.TX_UPDATE]: (state, { key, address, tx }) => {
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
  [WavesConstants.TX_REMOVE]: (state, { key, address }) => {
    const scope = state.pending[address]
    if (!scope || !scope[key]) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
  [WavesConstants.TX_ACCEPT]: (state, { entry }) => {
    return {
      ...state,
      lastRequestMeta: entry,
    }
  },
  [WavesConstants.TX_REJECT]: (state, { entry }) => {
    return {
      ...state,
      lastRequestMeta: entry,
    }
  },
  [WavesConstants.TX_PROCESS]: (state, { entry }) => {
    return {
      ...state,
      lastRequestMeta: entry,
    }
  },
  [WavesConstants.TX_SIGN]: (state, { entry }) => {
    return {
      ...state,
      lastRequestMeta: entry,
    }
  },
  [WavesConstants.TX_SIGN_ERROR]: (state, { error }) => {
    return {
      ...state,
      lastRequestMeta: error,
    }
  },
  [WavesConstants.TX_SEND_SIGNED]: (state, { entry }) => {
    return {
      ...state,
      lastRequestMeta: entry,
    }
  },
  [WavesConstants.TX_SEND_SIGNED_ERROR]: (state, { error }) => {
    return {
      ...state,
      lastRequestMeta: error,
    }
  },
}

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
