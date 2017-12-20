import contractsManagerDAO from 'dao/ContractsManagerDAO'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

export const getRewardsData = (silent = false) => async (dispatch) => {
  if (!silent) {
    dispatch({ type: REWARDS_FETCH_START })
  }
  const dao = await contractsManagerDAO.getRewardsDAO()
  const data = await dao.getRewardsData()
  dispatch({ type: REWARDS_DATA, data })
}

export const withdrawRevenue = () => async (dispatch) => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.withdraw()
  } catch (e) {
    // no rollback
  }
  return dispatch(getRewardsData())
}

export const closePeriod = () => async (dispatch) => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.closePeriod()
  } catch (e) {
    // no rollback
  }
}

export const watchInitRewards = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getRewardsDAO()
  dao.watchPeriodClosed(() => dispatch(getRewardsData(true)))
}
