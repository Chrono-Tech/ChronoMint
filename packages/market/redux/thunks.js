/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as MarketActions from './actions'
import * as MarketSelectors from './selectors'

// eslint-disable-next-line import/prefer-default-export
export const marketAddToken = (token) => (dispatch, getState) => {
  const state = getState()
  const tokensList = MarketSelectors.selectMarketTokens(state)
  if (!tokensList || !tokensList.includes(token)) {
    dispatch(MarketActions.marketAddToken(token))
  }
}

export const marketSelectCoin = (coin) => (dispatch, getState) => {
  const state = getState()
  const tokensList = MarketSelectors.selectMarketTokens(state)
  if (tokensList && tokensList.includes(coin)) {
    dispatch(MarketActions.marketSelectCoin(coin))
  } else {
    const errorMessage = `Error: can't select coin ${coin}. This token must be added before selection (use marketAddToken).`
    dispatch(MarketActions.marketSelectCoinFailure(errorMessage))
  }
}
