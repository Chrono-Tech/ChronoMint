import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { DUCK_TOKENS } from 'redux/tokens/actions'
import tokenService, { EVENT_NEW_TOKEN } from 'services/TokenService'
import TokenModel from 'models/tokens/TokenModel'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_INIT = 'rewards/init'
export const REWARDS_FETCH_START = 'rewards/FETCH_START'
export const REWARDS_DATA = 'rewards/DATA'

export const getRewardsData = () => async (dispatch, getState) => {
  const dao = await contractsManagerDAO.getRewardsDAO()
  const tokens = getState().get(DUCK_TOKENS)
  const callback = async (token: TokenModel) => {
    const data = await dao.getRewardsData(token)
    dispatch({ type: REWARDS_DATA, data })
  }
  if (tokens.item('TIME').isFetched()) {
    await callback(tokens.item('TIME'))
  } else {
    tokenService.on(EVENT_NEW_TOKEN, async (token) => {
      if (token.symbol() === 'TIME') {
        await callback(token)
      }
    })
  }
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

export const initRewards = () => async (dispatch, getState) => {
  if (getState().get(DUCK_REWARDS).isInited()) {
    return
  }
  dispatch({ type: REWARDS_INIT, isInited: true })

  const dao = await contractsManagerDAO.getRewardsDAO()
  dao.watchPeriodClosed(() => dispatch(getRewardsData()))
  dispatch(getRewardsData())
}
