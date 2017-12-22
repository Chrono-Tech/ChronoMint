import contractsManagerDAO from 'dao/ContractsManagerDAO'
import AssetModel from 'models/assetHolder/AssetModel'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { subscribeOnTokens } from 'redux/tokens/actions'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_INIT = 'rewards/init'
export const REWARDS_DATA = 'rewards/DATA'
export const REWARDS_ASSET = 'rewards/ASSET'
export const REWARDS_BASE_INFO = 'rewards/baseInfo'

let rewardDAO = null

export const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const rewardsHolder = getState().get(DUCK_REWARDS)
  const assets = rewardsHolder.assets()

  if (!token.isERC20() || !assets.list().has(token.address())) {
    return
  }

  dispatch(fetchRewardsData(token))
}

export const fetchRewardsData = (token) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const data = await rewardDAO.getRewardsData(account, token)
  // TODO @dkchv: !!!
  // dispatch({ type: REWARDS_DATA, data })
}

export const withdrawRevenue = () => async (dispatch) => {
  try {
    await rewardDAO.withdraw()
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw revenue error', e.message)
  }
  return dispatch(fetchRewardsData())
}

export const closePeriod = () => async () => {
  try {
    await rewardDAO.closePeriod()
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
  // init base info
  rewardDAO = await contractsManagerDAO.getRewardsDAO()

  return

  let [ addresses, periodCount, address ] = await Promise.all([
    rewardDAO.getAssets(),
    rewardDAO.getPeriodLength(),
    rewardDAO.getAddress(),
    rewardDAO.watchPeriodClosed(() => dispatch(fetchRewardsData())),
  ])
  dispatch({ type: REWARDS_BASE_INFO, address, periodCount })

  addresses.forEach((address) => {
    dispatch({ type: REWARDS_ASSET, asset: new AssetModel({ address }) })
  })

  // init tokens
  dispatch(subscribeOnTokens(handleToken))
}
