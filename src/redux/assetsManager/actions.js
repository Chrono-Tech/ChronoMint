import contractManager from 'dao/ContractsManagerDAO'
import Web3Converter from 'utils/Web3Converter'
import TokenModel from 'models/TokenModel'
import { ZERO_ADDRESS } from 'dao/AssetsManagerDAO'

export const GET_PLATFORMS_COUNT = 'AssetsManager/GET_PLATFORMS_COUNT'
export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const GET_TOKENS = 'AssetsManager/GET_TOKENS'
export const SET_TOKEN = 'AssetsManager/SET_TOKEN'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'
export const GET_MANAGERS_FOR_TOKEN = 'AssetsManager/GET_MANAGERS_FOR_TOKEN'
export const SELECT_TOKEN = 'AssetsManager/SELECT_TOKEN'
export const SELECT_PLATFORM = 'AssetsManager/SELECT_PLATFORM'
export const GET_MANAGERS_FOR_TOKEN_LOADING = 'AssetsManager/GET_MANAGERS_FOR_TOKEN_LOADING'
export const SET_WATCHERS = 'AssetsManager/SET_WATCHERS'
export const SET_TOTAL_SUPPLY = 'AssetsManager/SET_TOTAL_SUPPLY'
export const GET_TRANSACTIONS_START = 'AssetsManager/GET_TRANSACTIONS_START'
export const GET_TRANSACTIONS_DONE = 'AssetsManager/GET_TRANSACTIONS_DONE'
export const SET_IS_REISSUABLE = 'AssetsManager/SET_IS_REISSUABLE'
export const SET_NEW_MANAGERS_LIST = 'AssetsManager/SET_NEW_MANAGERS_LIST'

export const getPlatformsCount = () => async (dispatch, getState) => {
  const dao = await contractManager.getPlatformManagerDAO()
  const platformCount = await dao.getPlatformsCount(getState().get('session').account)
  dispatch({type: GET_PLATFORMS_COUNT, payload: {platformCount}})
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await platformManagerDao.getPlatformsMetadataForUser(account, dispatch, getState().get('assetsManager'))
  const assets = await assetsManagerDao.getAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(account)

  dispatch({type: GET_ASSETS_MANAGER_COUNTS, payload: {platforms, assets, managers}})
}

export const getPlatforms = () => async (dispatch, getState) => {
  const account = getState().get('session').account
  const dao = await contractManager.getPlatformManagerDAO()
  const platforms = await dao.getPlatformsMetadataForUser(account, dispatch, getState().get('assetsManager'))
  dispatch({type: GET_PLATFORMS, payload: {platforms}})
}

export const getTokens = () => async (dispatch, getState) => {
  const { account } = getState().get('session')
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
  const assets = await assetsManagerDao.getAssetsForOwner(account)
  const tokensMap = await ERC20ManagerDAO.getTokensByAddresses(Object.keys(assets), false, account, assets)
  dispatch({type: GET_TOKENS, payload: {tokensMap, assets}})
}

export const createPlatform = values => async dispatch => {
  try {
    const dao = await contractManager.getPlatformManagerDAO()
    if (values.get('alreadyHave')) {
      await dao.attachPlatform(values.get('platformAddress'))
    } else {
      await dao.createPlatform(values.get('platformName'))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const detachPlatform = platform => async dispatch => {
  const dao = await contractManager.getPlatformManagerDAO()
  const result = await dao.detachPlatform(platform)

  if (result) {
    dispatch(getPlatformsCount())
    dispatch(getPlatforms())
  }
}

export const watchPlatformManager = account => async (dispatch) => {
  const platformManagerDAO = await contractManager.getPlatformManagerDAO()
  platformManagerDAO.watchCreatePlatform(account, dispatch)
}

export const createAsset = values => async dispatch => {
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
      tokenImg,
    } = values.toObject()
    const tokenManagementExtension = await  contractManager.getTokenManagementExtensionDAO(platform.address)
    const tokenImgBytes32 = tokenImg ? Web3Converter.ipfsHashToBytes32(tokenImg) : ''

    if (withFee) {
      await tokenManagementExtension.createAssetWithFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable, feeAddress, feePercent, tokenImgBytes32)
    } else {
      await tokenManagementExtension.createAssetWithoutFee(tokenSymbol, tokenSymbol, description, amount, smallestUnit, reissuable, tokenImgBytes32)
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const getManagersForAssetSymbol = symbol => async dispatch => {
  dispatch({type: GET_MANAGERS_FOR_TOKEN_LOADING})
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const managersForAssetSymbol = await assetsManagerDAO.getManagersForAssetSymbol(symbol)
  dispatch({type: GET_MANAGERS_FOR_TOKEN, payload: {symbol, managersForAssetSymbol: managersForAssetSymbol}})
}

export const removeManager = (token: TokenModel, manager: String) => async dispatch => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.removeAssetPartOwner(token.symbol(), manager)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const addManager = (token: TokenModel, manager: String) => async dispatch => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.addAssetPartOwner(token.symbol(), manager)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const reissueAsset = (token: TokenModel, amount: number) => async dispatch => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.reissueAsset(token.symbol(), amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const revokeAsset = (token: TokenModel, amount: number) => async dispatch => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    await chronoBankPlatformDAO.revokeAsset(token.symbol(), amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const isReissuable = (token: TokenModel) => async dispatch => {
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(token.platform())
    const res = await chronoBankPlatformDAO.isReissuable(token.symbol())
    dispatch({type: SET_IS_REISSUABLE, payload: {symbol: token.symbol(), isReissuable: res}})
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const setTotalSupply = tx => (dispatch, getState) => {
  const symbol = Web3Converter.bytesToString(tx.args.symbol)
  const value = tx.args.value
  const event = tx.event
  const totalSupply = getState().get('assetsManager').tokensMap.getIn([symbol, 'totalSupply'])
  if (totalSupply && event === 'Issue') {
    dispatch({type: SET_TOTAL_SUPPLY, payload: {symbol, totalSupply: totalSupply.plus(value)}})
  } else if (totalSupply && event === 'Revoke') {
    dispatch({type: SET_TOTAL_SUPPLY, payload: {symbol, totalSupply: totalSupply.minus(value)}})
  }
}

export const getTransactions = () => async (dispatch, getState) => {
  dispatch({type: GET_TRANSACTIONS_START})
  let platforms = getState().get('assetsManager')['platformsList']
  const account = getState().get('session').account
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  if (!platforms.length) {
    platforms = await platformManagerDao.getPlatformsMetadataForUser(account, dispatch, getState().get('assetsManager'))
  }
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const transactionsList = await assetsManagerDAO.getTransactions(platforms, account)

  dispatch({type: GET_TRANSACTIONS_DONE, payload: {transactionsList: transactionsList}})
}

export const setTx = tx => async (dispatch, getState) => {
  const account = getState().get('session').account
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const txModel = await assetsManagerDAO.getTxModel(tx, account)
  dispatch({type: GET_TRANSACTIONS_DONE, payload: {transactionsList: [txModel]}})
}

export const setManagers = tx => async (dispatch, getState) => {
  const tokensMap = getState().get('assetsManager').tokensMap
  const account = getState().get('session').account
  const symbol = Web3Converter.bytesToString(tx.args.symbol)
  const from = tx.args.from
  const to = tx.args.to
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const managers = await assetsManagerDao.getManagers(account)
  let managersList = [...tokensMap.getIn([symbol, 'managersList'])]
  if (from === ZERO_ADDRESS) {
    if (managersList.indexOf(to) < 0) {
      managersList.push(to)
    }
  } else {
    managersList = managersList.filter(manager => manager !== from)
  }
  dispatch({type: SET_NEW_MANAGERS_LIST, payload: {managers, symbol, managersList}})
}

export const watchInitTokens = () => async (dispatch, getState) => {
  dispatch(getTransactions())
  const ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO()
  const account = getState().get('session').account
  const callback = async tx => {
    const assets = await assetsManagerDao.getAssetsForOwner(account)
    const tokensMap = await ERC20ManagerDAO.getTokensByAddresses([tx.args.token], false, account, assets)
    dispatch({type: SET_TOKEN, payload: {tokensMap, assets}})
    dispatch(setTx(tx))
  }
  const issueCallback = tx => {
    dispatch(setTotalSupply(tx))
    dispatch(setTx(tx))
  }
  const managersCallback = tx => {
    dispatch(setManagers(tx))
    dispatch(setTx(tx))
  }


  return Promise.all([
    ERC20ManagerDAO.watchAddToken(callback),
    chronoBankPlatformDAO.watchIssue(issueCallback),
    chronoBankPlatformDAO.watchRevoke(issueCallback),
    chronoBankPlatformDAO.watchManagers(managersCallback),
  ])
}

export const getLatestVersion = (token: TokenModel) => async (dispatch, getState) => {
  // const account = getState().get('session').account
  // const dao = await contractManager.getChronoBankAssetProxyDAO(token.address())
  // const res = await dao.getLatestVersion()
  // eslint-disable-next-line
  // console.log('--actions#: res', res)
}
