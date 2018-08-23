/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import { TxEntryModel, TxExecModel } from '../../models'
import { TX_CREATE, TX_REMOVE, TX_STATUS, TX_UPDATE } from './constants'

const initialState = () => ({
  pending: {},
})

const mutations = {
  [TX_CREATE] (state, { entry }) {
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
  [TX_STATUS] (state, { key, address, props }) {
    const scope = state.pending[address]
    if (!scope) {
      return state
    }
    const entry = scope[key]
    if (!entry) {
      return state
    }
    return {
      ...state,
      pending: {
        [address]: {
          ...scope,
          [key]: new TxEntryModel({
            ...entry,
            ...props,
          }),
        },
      },
    }
  },
  [TX_UPDATE] (state, { key, address, props }) {
    const scope = state.pending[address]
    if (!scope) return state
    const entry = scope[key]
    if (!entry) return state
    return {
      ...state,
      pending: {
        [address]: {
          ...scope,
          [key]: new TxEntryModel({
            ...entry,
            ...props,
            tx: new TxExecModel({
              ...entry.tx,
            }),
          }),
        },
      },
    }
  },
  [TX_REMOVE] (state, { key, address }) {
    const scope = state.pending[address]
    if (!scope) return state
    const entry = scope[key]
    if (!entry) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
}

export default (state = initialState(), { type, ...other }) => {
  // return [state, other]
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
