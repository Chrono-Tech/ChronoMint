/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import initialState from './initialState'
import * as ActionTypes from './constants'
import middlewareMutations from '../middleware/reducers'

const marketReset = () => ({
  ...initialState,
})
const marketAddToken = (state, payload) => ({
  ...state,
  tokens: [
    ...state.tokens,
    payload.symbol,
  ],
})

const marketSelectCoin = (state, payload) => ({
  ...state,
  selectedCoin: payload.coin,
})

const marketSelectCoinFailure = (state) => state

const mutations = {
  [ActionTypes.MARKET_ADD_TOKEN]: marketAddToken,
  [ActionTypes.MARKET_RESET]: marketReset,
  [ActionTypes.MARKET_SELECT_COIN_FAILURE]: marketSelectCoinFailure,
  [ActionTypes.MARKET_SELECT_COIN]: marketSelectCoin,
}

export default (state = initialState, { type, ...payload }) => {
  const marketMutations = {
    ...middlewareMutations,
    ...mutations,
  }
  return (type in marketMutations)
    ? marketMutations[type](state, payload)
    : state
}
