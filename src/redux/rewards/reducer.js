import RewardsCollection from '@/models/rewards/RewardsCollection'
import RewardsModel from 'models/rewards/RewardsModel'
import * as a from './actions'

const initialState = new RewardsCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.REWARDS_INIT:
      return state.isInited(action.isInited)

    case a.REWARDS_BASE_INFO:
      return state
        .address(action.address)
        .periods().leftToFetch(action.periodCount)
    case a.REWARDS_ASSET:
      return state.assets(state.assets().update(action.asset))
    case a.REWARDS_DATA:
      return state
        .merge(action.data)
        .isFetching(false)
        .isFetched(true)
    default:
      return state
  }
}
