/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import RewardsCollection from '../../models/rewards/RewardsCollection'
import * as a from './constants'

const initialState = new RewardsCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.REWARDS_INIT:
      return state.isInited(action.isInited)
    case a.REWARDS_PERIOD_COUNT:
      return state
        .leftToFetch(action.count)
        // TODO @dkchv: !!! remove this
        .periodCount(action.count)
    case a.REWARDS_BASE_INFO:
      return state
        .address(action.address)
        .assets(action.assets)
    case a.REWARDS_ASSET:
      return state.assets(state.assets().update(action.asset))
    case a.REWARDS_PERIOD:
      return state.itemFetched(action.period)
    default:
      return state
  }
}
