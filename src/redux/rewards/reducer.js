import RewardsModel from 'models/rewards/RewardsModel'
import * as a from './actions'

const initialState = new RewardsModel()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.REWARDS_INIT:
      return state.isInited(action.isInited)
    case a.REWARDS_DATA:
      return state
        .merge(action.data)
        .isFetching(false)
        .isFetched(true)
    case a.REWARDS_FETCH_START:
      return state.isFetching(true)
    default:
      return state
  }
}
