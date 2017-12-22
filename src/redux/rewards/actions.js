import contractsManagerDAO from 'dao/ContractsManagerDAO'
import TokenModel from 'models/tokens/TokenModel'
import { subscribeOnTokens } from 'redux/tokens/actions'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_INIT = 'rewards/init'
export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

let rewardDAO = null

export const handleToken = (token: TokenModel) => async (dispatch) => {
  if (token.symbol() !== 'TIME') {
    return
  }
  dispatch(getRewardsData(token))
}

export const getRewardsData = (token) => async (dispatch) => {
  const data = await rewardDAO.getRewardsData(token)
  dispatch({ type: REWARDS_DATA, data })
}

export const withdrawRevenue = () => async (dispatch) => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.withdraw()
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw revenue error', e.message)
  }
  return dispatch(getRewardsData())
}

export const closePeriod = () => async (dispatch) => {
  dispatch({ type: REWARDS_FETCH_START })
  const dao = await contractsManagerDAO.getRewardsDAO()
  try {
    await dao.closePeriod()
  } catch (e) {
    // eslint-disable-next-line
    console.error('close period error', e.message)
  }
}

export const initRewards = () => async (dispatch, getState) => {
  if (getState().get(DUCK_REWARDS).isInited()) {
    return
  }
  dispatch({ type: REWARDS_INIT, isInited: true })
  // init
  rewardDAO = await contractsManagerDAO.getRewardsDAO()
  await rewardDAO.watchPeriodClosed(() => dispatch(getRewardsData()))
  dispatch(subscribeOnTokens(handleToken))
}
