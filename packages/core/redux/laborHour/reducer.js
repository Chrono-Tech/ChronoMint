/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { omit } from 'lodash'
import * as types from './constants'
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
  miningParams: {
    feeMultiplier: 1,
  },
  timeHolder: {
    deposit: {},
    lockedDeposit: {},
  },
  statuses: {
    middleware: types.STATUS_DISCONNECTED,
  },
  rewards: {
    total: null,
    list: {},
    isLoading: false, // flag for list
  },
}

const mutations = {
  [types.LABOR_HOUR_WEB3_UPDATE]: (state, { web3 }) => {
    return {
      ...state,
      web3,
    }
  },
  [types.LABOR_HOUR_UPDATE_MIDDLEWARE_CONNECTING_STATUS]: (state, { status }) => {
    return {
      ...state,
      statuses: {
        ...state.statuses,
        middleware: status,
      },
    }
  },
  [types.LABOR_HOUR_DAOS_REGISTER] (state, { model }) {
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
  [types.LABOR_HOUR_SWAP_UPDATE]: (state, { swap }) => {
    return {
      ...state,
      swaps: {
        ...state.swaps,
        [swap.swapId]: swap,
      },
    }
  },
  [types.LABOR_HOUR_SWAP_LIST_UPDATE]: (state, { swaps }) => {
    return {
      ...state,
      swaps: {
        ...state.swaps,
        ...swaps,
      },
    }
  },
  [types.LABOR_HOUR_TOKENS_FETCHING]: (state, { count }) => {
    return {
      ...state,
      tokens: state.tokens.leftToFetch(count),
    }
  },
  [types.LABOR_HOUR_TOKENS_FETCHED]: (state, { token }) => {
    return {
      ...state,
      tokens: state.tokens.itemFetched(token),
    }
  },
  [types.LABOR_HOUR_TOKENS_FAILED]: (state) => {
    return {
      ...state,
      tokens: state.tokens.leftToFetch(state.leftToFetch() - 1),
    }
  },
  [types.LABOR_HOUR_TOKENS_UPDATE_LATEST_BLOCK]: (state, { blockchain, block }) => {
    return {
      ...state,
      tokens: state.tokens.latestBlocks({
        ...state.tokens.latestBlocks(),
        [blockchain]: block,
      }),
    }
  },
  [types.LABOR_HOUR_UPDATE_WALLET]: (state, { wallet }) => {
    return {
      ...state,
      wallets: {
        ...state.wallets,
        [`${wallet.blockchain}-${wallet.address}`]: wallet,
      },
    }
  },
  [types.LABOR_HOUR_UNSET_WALLET]: (state, { wallet }) => {
    const list = { ...state.list }
    delete list[wallet.id]
    return {
      ...state,
      list: {
        ...list,
      },
    }
  },
  [types.LABOR_HOUR_TX_CREATE]: (state, { entry }) => {
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
  [types.LABOR_HOUR_TX_UPDATE]: (state, { key, address, tx }) => {
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
  [types.LABOR_HOUR_TX_REMOVE]: (state, { key, address }) => {
    const scope = state.pending[address]
    if (!scope || !scope[key]) return state
    return {
      ...state,
      pending: omit(state.pending, [key]),
    }
  },
  [types.LABOR_HOUR_DEPOSIT_PARAMS_UPDATE]: (state, { minDepositLimit, rewardsCoefficient }) => {
    return {
      ...state,
      miningParams: {
        minDepositLimit,
        rewardsCoefficient,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_MINING_NODE_TYPE]: (state, { miningParams }) => {
    return {
      ...state,
      miningParams: {
        ...state.miningParams,
        ...miningParams,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_FEE_MULTIPLIER]: (state, { feeMultiplier }) => {
    return {
      ...state,
      miningParams: {
        ...state.miningParams,
        feeMultiplier,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_DEPOSIT]: (state, { address, amount }) => {
    return {
      ...state,
      timeHolder: {
        ...state.timeHolder,
        deposit: {
          ...state.timeHolder.deposit,
          [address]: amount,
        },
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_LOCKED_DEPOSIT]: (state, { address, amount }) => {
    return {
      ...state,
      timeHolder: {
        ...state.timeHolder,
        lockedDeposit: {
          ...state.timeHolder.lockedDeposit,
          [address]: amount,
        },
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_PROCESSING_STATUS]: (state, { status }) => {
    return {
      ...state,
      miningParams: {
        ...state.miningParams,
        processingStatus: status,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_TOTAL_REWARDS]: (state, { total }) => {
    return {
      ...state,
      rewards: {
        ...state.rewards,
        total,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_REWARDS_BLOCKS_LIST]: (state, { list }) => {
    return {
      ...state,
      rewards: {
        ...state.rewards,
        list,
        isLoading: false,
      },
    }
  },
  [types.LABOR_HOUR_UPDATE_REWARDS_BLOCKS_LIST_LOADING_FLAG]: (state, { isLoading }) => {
    return {
      ...state,
      rewards: {
        ...state.rewards,
        isLoading,
      },
    }
  },
}

export default (state = initialState, { type, ...payload }) => {
  return type in mutations ? mutations[type](state, payload) : state
}
