import contractManager from 'dao/ContractsManagerDAO'
import Web3Converter from 'utils/Web3Converter'

export const GET_PLATFORMS_COUNT = 'AssetsManager/GET_PLATFORMS_COUNT'
export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const GET_TOKENS = 'AssetsManager/GET_TOKENS'
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

  const assets = await assetsManagerDao.getAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(account)

  dispatch({type: GET_ASSETS_MANAGER_COUNTS, payload: {platforms, assets, managers}})
}

export const getPlatforms = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const dao = await contractManager.getPlatformManagerDAO()

  const platforms = await dao.getPlatformsMetadataForUser(account)
  dispatch({type: GET_PLATFORMS, payload: {platforms}})
}

export const getTokens = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
  const assets = await assetsManagerDao.getAssetsForOwner(account)
  const tokensMap = await ERC20ManagerDAO.getTokens(Object.keys(assets), assets)

  dispatch({type: GET_TOKENS, payload: {tokensMap, assets}})
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
  const platformManagerDAO = await contractManager.getPlatformManagerDAO()
  const tokenManagementExtensionDAO = await contractManager.getTokenManagementExtensionDAO()
  platformManagerDAO.watchCreatePlatform(account)
  tokenManagementExtensionDAO.watchToken(account)
}

export const createAsset = (values) => async (dispatch) => {
  try {
    const {
      amount,
      description = '',
      feePercent,
      platform,
      reissuable = false,
      smallestUnit,
      tokenSymbol,
      withFee = false,
      feeAddress,
      tokenImg
    } = values.toObject()
    const tokenManagementExtension = await  contractManager.getTokenManagementExtensionDAO(platform.address)
    let result
    const tokenImgBytes32 = tokenImg ? Web3Converter.ipfsHashToBytes32(tokenImg) : ''

    if (withFee) {
      result = await tokenManagementExtension.createAssetWithFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable, feeAddress, feePercent, tokenImgBytes32)
    } else {
      // eslint-disable-next-line
      console.log('tokenSymbol=', tokenSymbol, 'tokenSymbol=', tokenSymbol, 'description=', description, 'amount=', amount, 'smallestUnit=', smallestUnit, 'reissuable=', reissuable, 'tokenImgBytes32=', JSON.stringify(tokenImgBytes32))
      result = await tokenManagementExtension.createAssetWithoutFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable, tokenImgBytes32)
    }
    if (result) {
      dispatch(getTokens())
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}
