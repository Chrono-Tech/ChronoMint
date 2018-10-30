/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as ActionTypes from './constants'

export const marketAddToken = (symbol) => ({
  type: ActionTypes.MARKET_ADD_TOKEN,
  symbol,
})

export const marketSelectCoin = (coin) => ({
  type: ActionTypes.MARKET_SELECT_COIN,
  coin,
})

export const marketSelectCoinFailure = (coin) => ({
  type: ActionTypes.MARKET_SELECT_COIN_FAILURE,
  coin,
})
