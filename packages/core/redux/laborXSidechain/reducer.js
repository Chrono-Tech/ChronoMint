/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import {
  LABOR_X_SIDECHAIN_TX_CREATE,
  LABOR_X_SIDECHAIN_TX_REMOVE,
  LABOR_X_SIDECHAIN_TX_UPDATE,
  LABOR_X_SIDECHAIN_UPDATE_WALLET,
  LABOR_X_SIDECHAIN_WEB3_UPDATE,
  LABOR_X_SIDECHAIN_DAOS_REGISTER,
  LABOR_X_SIDECHAIN_SWAP_UPDATE,
  LABOR_X_SIDECHAIN_TOKENS_FETCHING,
  LABOR_X_SIDECHAIN_TOKENS_FETCHED,
  LABOR_X_SIDECHAIN_TOKENS_FAILED,
} from './constants'
import TokensCollection from '../../models/tokens/TokensCollection'

const initialState = {
  wallets: {},
  pending: {}, // pending transactions
  tokens: new TokensCollection(),
  daos: {
    byType: {},
    byAddress: {},
  },
  swaps: {},
}

const mutations = {
  [LABOR_X_SIDECHAIN_WEB3_UPDATE]: (state, { web3 }) => {
    return {
      ...state,
      web3,
    }
  },
  [LABOR_X_SIDECHAIN_DAOS_REGISTER] (state, { model }) {
    return {
      ...state,
      daos: {
        byType: {
          ...state.daos.byType,
          [model.contract.type]: model,
        },
        byAddress: {
          ...state.daos.byAddress,
          [model.address]: model,
        },
      },
    }
  },
  [LABOR_X_SIDECHAIN_SWAP_UPDATE]: (state, { swap }) => {
    return {
      ...state,
      swaps: {
        ...state.swaps,
        [swap.id]: swap,
      },
    }
  },
  [LABOR_X_SIDECHAIN_TOKENS_FETCHING]: (state, { count }) => {
    return {
      ...state,
      tokens: state.tokens.leftToFetch(count),
    }
  },
  [LABOR_X_SIDECHAIN_TOKENS_FETCHED]: (state, { token }) => {
    return {
      ...state,
      tokens: state.tokens.itemFetched(token),
    }
  },
  [LABOR_X_SIDECHAIN_TOKENS_FAILED]: (state) => {
    return {
      ...state,
      tokens: state.tokens.leftToFetch(state.leftToFetch() - 1),
    }
  },
  [LABOR_X_SIDECHAIN_UPDATE_WALLET]: (state, { wallet }) => {
    return {
      ...state,
      wallets: {
        ...state.wallets,
        [`${wallet.blockchain}-${wallet.address}`]: wallet,
      },
    }
  },
  [LABOR_X_SIDECHAIN_TX_CREATE]: (state, { entry }) => {
    const account = entry.tx.from
    const pending = state.pending
    const scope = pending[account]
    return {
      ...state,
      pending: {
        ...pending,
        [account]: {
          ...scope,
          [entry.key]: entry,
        },
      },
    }
  },
  [LABOR_X_SIDECHAIN_TX_UPDATE]: (state, { key, address, tx }) => {
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
  [LABOR_X_SIDECHAIN_TX_REMOVE]: (state, { key, address }) => {
    const scope = state.pending[address]
    if (!scope || !scope[key]) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
}

export default (state = initialState, { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
