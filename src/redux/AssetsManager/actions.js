import contractManager from 'dao/ContractsManagerDAO'

export const GET_PLATFORMS_COUNT = 'AssetsManager/GET_PLATFORMS_COUNT'
export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'

export const getPlatformsCount = () => async (dispatch, getState) => {
  const dao = await contractManager.getPlatformManagerDAO()
  const platformCount = await dao.getPlatformsCount(getState().get('session').account)
  dispatch({type: GET_PLATFORMS_COUNT, payload: {platformCount}})
}

export const getPlatforms = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const dao = await contractManager.getPlatformManagerDAO()
  const platformsCount = await dao.getPlatformsCount(account)
  let platformsList = []
  for (let i = 0; i < platformsCount; i++) {
    const platform = await dao.getPlatformForUserAtIndex(account, i)
    platformsList.push(platform)
  }
  dispatch({type: GET_PLATFORMS, payload: {platformsList}})
}

export const createPlatform = (values) => async (dispatch, getState) => {

  try {
    const dao = await contractManager.getPlatformManagerDAO()
    let result
    if (values.get('alreadyHave')) {
      result = await dao.attachPlatform(values.get('platformAddress'))
    } else {
      result = await dao.createPlatform(values.get('platformName'), getState().get('session').account)
    }

    // eslint-disable-next-line
    // console.log('--actions#result', result)

    if (result) {
      dispatch(getPlatformsCount())
      dispatch(getPlatforms())
    }

  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}


export const detachPlatform = (platform) => async (dispatch) => {
  const dao = await contractManager.getPlatformManagerDAO()
  const result = await dao.detachPlatform(platform)
  // eslint-disable-next-line
  // console.log('--actions#detachPlatform', result)

  if (result) {
    dispatch(getPlatformsCount())
    dispatch(getPlatforms())
  }
}

export const watchAssetManager = (account) => async () => {
  const dao = await contractManager.getPlatformManagerDAO()
  dao.watchCreatePlatform(account)
}
