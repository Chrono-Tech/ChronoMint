import contractsManagerDAO from 'dao/ContractsManagerDAO'
import AssetModel from 'models/assetHolder/AssetModel'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { subscribeOnTokens } from 'redux/tokens/actions'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_INIT = 'rewards/init'
export const REWARDS_DATA = 'rewards/DATA'
export const REWARDS_ASSET = 'rewards/ASSET'

let rewardDAO = null

export const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const rewardsHolder = getState().get(DUCK_REWARDS)
  const assets = rewardsHolder.assets()

  console.log('--actions#', 1111, assets, token.address(), token.symbol(), assets.list().has(token.address()))

  console.log('--actions#', !token.isERC20(), !assets.list().has(token.address()))
  if (!token.isERC20() || !assets.list().has(token.address())) {
    return
  }

  dispatch(fetchRewardsData(token))
}

export const fetchRewardsData = (token) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const data = await rewardDAO.getRewardsData(account, token)
  dispatch({ type: REWARDS_DATA, data })
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
  // init
  rewardDAO = await contractsManagerDAO.getRewardsDAO()
  // init assets
  let [ addresses ] = await Promise.all([
    rewardDAO.getAssets(),
    rewardDAO.watchPeriodClosed(() => dispatch(fetchRewardsData())),
  ])

  addresses.forEach((address) => {
    dispatch({ type: REWARDS_ASSET, asset: new AssetModel({ address }) })
  })

  // init tokens
  dispatch(subscribeOnTokens(handleToken))
}
