import contractsManagerDAO from 'dao/ContractsManagerDAO'
import RewardsModel from 'models/RewardsModel'

export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

const initialState = {
  data: new RewardsModel(),
  isFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case REWARDS_DATA:
      return {
        ...state,
        data: action.data,
        isFetching: false,
        isFetched: true,
      }
    case REWARDS_FETCH_START:
      return {
        ...state,
        isFetching: true,
      }
    default:
      return state
  }
}

export const getRewardsData = (silent = false) => async dispatch => {
  if (!silent) {
    dispatch({ type: REWARDS_FETCH_START })
  }
  const dao = await contractsManagerDAO.getRewardsDAO()
  const data = await dao.getRewardsData()
  dispatch({ type: REWARDS_DATA, data })
}

export const withdrawRevenue = () => async dispatch => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.withdraw()
  } catch (e) {
    // no rollback
  }
  return dispatch(getRewardsData())
}

export const closePeriod = () => async dispatch => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.closePeriod()
  } catch (e) {
    // no rollback
  }
}

export const watchInitRewards = () => async dispatch => {
  const dao = await contractsManagerDAO.getRewardsDAO()
  dao.watchPeriodClosed(() => dispatch(getRewardsData(true)))
}
