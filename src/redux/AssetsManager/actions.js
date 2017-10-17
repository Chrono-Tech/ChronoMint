import contractManager from 'dao/ContractsManagerDAO'

export const GET_PLATFORMS_COUNT = 'AssetsManager/GET_PLATFORMS_COUNT'
export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'

export const getPlatformsCount = () => async (dispatch, getState) => {
  const dao = await contractManager.getPlatformManagerDAO()
  const platformCount = await dao.getPlatformsCount(getState().get('session').account)
  dispatch({type: GET_PLATFORMS_COUNT, payload: {platformCount}})
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await platformManagerDao.getPlatformsMetadataForUser(account)

  const tokens = await assetsManagerDao.getAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(account)

  dispatch({type: GET_ASSETS_MANAGER_COUNTS, payload: {platforms, tokens, managers}})
}

export const getPlatforms = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const dao = await contractManager.getPlatformManagerDAO()

  const platforms = await dao.getPlatformsMetadataForUser(account)
  dispatch({type: GET_PLATFORMS, payload: {platforms}})
}
export const createPlatform = (values) => async (dispatch) => {

  try {
    const dao = await contractManager.getPlatformManagerDAO()
    let result
    if (values.get('alreadyHave')) {
      result = await dao.attachPlatform(values.get('platformAddress'))
    } else {
      result = await dao.createPlatform(values.get('platformName'))
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

  if (result) {
    dispatch(getPlatformsCount())
    dispatch(getPlatforms())
  }
}

export const watchAssetManager = (account) => async () => {
  const dao = await contractManager.getPlatformManagerDAO()
  dao.watchCreatePlatform(account)
}

export const createAsset = (values) => async (/*dispatch*/) => {
  try {
    const {amount, description, feePercent, platform, reissuable, smallestUnit, tokenSymbol, withFee, feeAddress} = values.toObject()
    const tokenManagementExtension = await  contractManager.getTokenManagementExtensionDAO(platform.address)

    if (withFee) {
      tokenManagementExtension.createAssetWithFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable, feeAddress, feePercent)
    } else {
      tokenManagementExtension.createAssetWithoutFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable)
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}
