import RewardsCollection from 'models/rewards/RewardsCollection'
import * as a from './actions'

const initialState = new RewardsCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.REWARDS_INIT:
      return state.isInited(action.isInited)
    case a.REWARDS_BASE_INFO:
      return state
        .address(action.address)
        .leftToFetch(action.periodCount)
        .periodCount(action.periodCount)
        .assets(action.assets)
    case a.REWARDS_ASSET:
      return state.assets(state.assets().update(action.asset))
    case a.REWARDS_PERIOD:
      return state.itemFetched(action.period)
    case a.REWARDS_DATA:
      return state
        .merge(action.data)
        .isFetching(false)
        .isFetched(true)
    default:
      return state
  }
}
