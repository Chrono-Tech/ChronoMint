/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import { HolderModel, TxEntryModel, TxExecModel } from '../../models'
import { NONCE_UPDATE, TX_CREATE, TX_REMOVE, TX_STATUS, TX_UPDATE, WEB3_UPDATE } from './constants'

const initialState = () => ({
  web3: null,
  nonces: {},
  pending: {},
})

const mutations = {
  [WEB3_UPDATE]: (state, { web3 }) => ({
    ...state,
    web3: new HolderModel({ value: web3 }),
  }),

  [NONCE_UPDATE]: (state, { address, nonce }) => ({
    ...state,
    nonces: {
      ...state.nonces,
      [address]: nonce,
    },
  }),

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
  [TX_STATUS]: (state, { key, address, props }) => {
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
  [TX_UPDATE]: (state, { key, address, props }) => {
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
  [TX_REMOVE]: (state, { key, address }) => {
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

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
