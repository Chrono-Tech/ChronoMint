import RewardsModel from 'models/RewardsModel'
import * as a from './actions'

const initialState = {
  data: new RewardsModel(),
  isFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.REWARDS_DATA:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        isFetched: true,
      }
    case a.REWARDS_FETCH_START:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state
  }
}
