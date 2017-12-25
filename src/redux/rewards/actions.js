import contractsManagerDAO from 'dao/ContractsManagerDAO'
import { EE_REWARDS_ERROR, EE_REWARDS_PERIOD, EE_REWARDS_PERIOD_CLOSED } from 'dao/RewardsDAO'
import AssetModel from 'models/assetHolder/AssetModel'
import RewardsPeriodModel from 'models/rewards/RewardsPeriodModel'
import TokenModel from 'models/tokens/TokenModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { subscribeOnTokens } from 'redux/tokens/actions'

export const DUCK_REWARDS = 'rewards'

export const REWARDS_INIT = 'rewards/init'
export const REWARDS_ASSET = 'rewards/ASSET'
export const REWARDS_BASE_INFO = 'rewards/baseInfo'
export const REWARDS_PERIOD = 'rewards/period'
export const REWARDS_PERIOD_COUNT = 'rewards/periodCount'

let rewardDAO = null

export const handleToken = (token: TokenModel) => async (dispatch, getState) => {
  const rewardsHolder = getState().get(DUCK_REWARDS)
  const assets = rewardsHolder.assets()
  const { account } = getState().get(DUCK_SESSION)

  if (!token.isERC20() || !assets.list().has(token.address())) {
    return
  }

  // init asset
  const asset: AssetModel = assets.item(token.address()).symbol(token.symbol())
  dispatch({ type: REWARDS_ASSET, asset })
  // fetch period for asset
  rewardDAO.fetchPeriods(rewardsHolder.periodCount(), asset, account)
}

export const withdrawRevenue = () => async (dispatch, getState) => {
  try {
    // TODO @dkchv: !!! hardcoded for TIME
    const asset: AssetModel = getState().get(DUCK_REWARDS).assets().first(true)
    const { account } = getState().get(DUCK_SESSION)
    await rewardDAO.withdraw(account, asset)
  } catch (e) {
    // eslint-disable-next-line
    console.error('withdraw revenue error', e.message)
  }
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
  let [ assets, count, address ] = await Promise.all([
    rewardDAO.getAssets(),
    rewardDAO.getLastPeriod(),
    rewardDAO.getAddress(),
  ])
  dispatch({ type: REWARDS_PERIOD_COUNT, count })
  dispatch({ type: REWARDS_BASE_INFO, address, assets })

  // subscribe
  rewardDAO
    .on(EE_REWARDS_PERIOD_CLOSED, () => {
      const { account } = getState().get(DUCK_SESSION)
      // fetch new period
      const rewardsHolder = getState().get(DUCK_REWARDS)
      const count = rewardsHolder.size()
      dispatch({ type: REWARDS_PERIOD_COUNT, count: 1 })
      const assets = rewardsHolder.assets()
      assets.items().forEach((asset: AssetModel) => {
        rewardDAO.fetchPeriod(count, asset, account)
      })
    })
    .on(EE_REWARDS_PERIOD, (period: RewardsPeriodModel) => {
      dispatch({ type: REWARDS_PERIOD, period })
    })
    .on(EE_REWARDS_ERROR, (result) => {
      // eslint-disable-next-line
      console.error('rewards error', e.message, result.args)
    })

  await rewardDAO.watch()
  dispatch(subscribeOnTokens(handleToken))
}
