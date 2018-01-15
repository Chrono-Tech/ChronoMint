import contractManager from 'dao/ContractsManagerDAO'
import ERC20ManagerDAO from 'dao/ERC20ManagerDAO'
import ReissuableModel from 'models/tokens/ReissuableModel'
import TokenModel from 'models/tokens/TokenModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS, TOKENS_FETCHED, TOKENS_REMOVE, TOKENS_UPDATE } from 'redux/tokens/actions'
import Web3Converter from 'utils/Web3Converter'

export const DUCK_ASSETS_MANAGER = 'assetsManager'

export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const SET_ASSETS = 'AssetsManager/SET_ASSETS'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'
export const GET_ASSETS_MANAGER_COUNTS_START = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS_START'
export const SELECT_TOKEN = 'AssetsManager/SELECT_TOKEN'
export const SELECT_PLATFORM = 'AssetsManager/SELECT_PLATFORM'
export const GET_TRANSACTIONS_START = 'AssetsManager/GET_TRANSACTIONS_START'
export const GET_TRANSACTIONS_DONE = 'AssetsManager/GET_TRANSACTIONS_DONE'
export const SET_NEW_MANAGERS_LIST = 'AssetsManager/SET_NEW_MANAGERS_LIST'
export const GET_USER_PLATFORMS = 'AssetsManager/GET_USER_PLATFORMS'

export const getUsersPlatforms = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  const usersPlatforms = await platformManagerDao.getPlatformsMetadataForUser(account, dispatch, getState().get(DUCK_ASSETS_MANAGER))
  dispatch({ type: GET_USER_PLATFORMS, payload: { usersPlatforms } })
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getParticipatingPlatformsForUser(account)
  const assets = await assetsManagerDao.getSystemAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(account)
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS, payload: { platforms, assets, managers } })
}

export const getPlatforms = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getParticipatingPlatformsForUser(account)
  dispatch({ type: GET_PLATFORMS, payload: { platforms } })
}

export const createPlatform = (values) => async () => {
  try {
    const dao = await contractManager.getPlatformManagerDAO()
    if (values.get('alreadyHave')) {
      await dao.attachPlatform(values.get('platformAddress'))
    } else {
      await dao.createPlatform()
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
    dispatch(getPlatforms())
  }
}

export const watchPlatformManager = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const platformManagerDAO = await contractManager.getPlatformManagerDAO()
  const callback = (tx) => {
    dispatch(setTx(tx))
    dispatch(getUsersPlatforms())
    dispatch(getPlatforms())
  }
  platformManagerDAO.watchCreatePlatform(callback, account)
}

export const createAsset = (token: TokenModel) => async (dispatch, getState) => {
  try {
    let txHash
    const tokenManagementExtension = await contractManager.getTokenManagementExtensionDAO(token.platform().address)
    if (token.withFee()) {
      txHash = await tokenManagementExtension.createAssetWithFee(token)
    } else {
      txHash = await tokenManagementExtension.createAssetWithoutFee(token)
    }
    let { assets } = getState().get(DUCK_ASSETS_MANAGER)
    assets[ txHash ] = {
      address: txHash,
      platform: token.platform().address,
      totalSupply: token.totalSupply(),
    }

    await dispatch({
      type: TOKENS_UPDATE,
      token: token.isPending(true).transactionHash(txHash),
    })
    await dispatch({ type: SET_ASSETS, payload: { assets } })
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const getManagersForAssetSymbol = async (symbol: string) => {
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const managersList = await assetsManagerDAO.getManagersForAssetSymbol(symbol)
  return managersList.isFetched(true)
}

export const removeManager = (token: TokenModel, owner: string) => async (dispatch, getState) => {
  try {
    const { assets } = getState().get(DUCK_ASSETS_MANAGER)
    const platform = token.platform() && token.platform().address || assets[ token.address() ].platform
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform)
    return await chronoBankPlatformDAO.removeAssetPartOwner(token.symbol(), owner)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const addManager = (token: TokenModel, owner: string) => async (dispatch, getState) => {
  try {
    const { assets } = getState().get(DUCK_ASSETS_MANAGER)
    const platform = token.platform() && token.platform().address || assets[ token.address() ].platform
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform)
    return await chronoBankPlatformDAO.addAssetPartOwner(token.symbol(), owner)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const reissueAsset = (token: TokenModel, amount: number) => async (dispatch, getState) => {
  try {
    const { assets } = getState().get(DUCK_ASSETS_MANAGER)
    const platform = token.platform() && token.platform().address || assets[ token.address() ].platform
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform)
    await chronoBankPlatformDAO.reissueAsset(token, amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const revokeAsset = (token: TokenModel, amount: number) => async (dispatch, getState) => {
  try {
    const { assets } = getState().get(DUCK_ASSETS_MANAGER)
    const platform = token.platform() && token.platform().address || assets[ token.address() ].platform
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform)
    await chronoBankPlatformDAO.revokeAsset(token, amount)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const checkIsReissuable = async (token: TokenModel, asset) => {
  let isReissuable = false
  try {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(asset.platform)
    isReissuable = await chronoBankPlatformDAO.isReissuable(token.symbol())
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
  return new ReissuableModel({ value: isReissuable }).isFetched(true)
}

export const getTransactions = () => async (dispatch, getState) => {
  dispatch({ type: GET_TRANSACTIONS_START })
  const { account } = getState().get(DUCK_SESSION)
  const tokens = getState().get(DUCK_TOKENS)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const transactionsList = await assetsManagerDAO.getTransactions(account, tokens)

  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

export const setTx = (tx) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const txModel = await assetsManagerDAO.getTxModel(tx, account)
  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList: [ txModel ] } })
}

export const setManagers = (tx) => async (dispatch, getState) => {
  try {
    const symbol = Web3Converter.bytesToString(tx.args.symbol)
    const { account } = getState().get(DUCK_SESSION)

    let { selectedToken } = getState().get(DUCK_ASSETS_MANAGER)
    const tokens = getState().get(DUCK_TOKENS)
    let token = tokens.getBySymbol(symbol)

    if (tx.args.from === account) {
      if (selectedToken === symbol) {
        dispatch({ type: SELECT_TOKEN, payload: { selectedToken: null } })
      }
      dispatch(getAssetsManagerData())
    } else {
      const { from, to } = tx.args
      const assetsManagerDao = await contractManager.getAssetsManagerDAO()
      if (token && token.managersList().isFetched()) {
        let managersList = token.managersList()
        if (assetsManagerDao.isEmptyAddress(from)) {
          managersList = managersList.add(new OwnerModel({ address: to }))
        } else {
          managersList = managersList.remove(new OwnerModel({ address: from }))
        }

        dispatch({
          type: TOKENS_FETCHED,
          token: token.managersList(managersList),
        })
      }
    }
  } catch (e) {
    // eslint-disable-next-line
    console.log(e)
  }
}

export const watchInitTokens = () => async (dispatch, getState) => {
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS_START })
  dispatch(getUsersPlatforms())
  dispatch(getTransactions())
  const { account } = getState().get(DUCK_SESSION)
  const [ assetsManagerDao, chronoBankPlatformDAO, platformTokenExtensionGatewayManagerEmitterDAO ] = await Promise.all([
    contractManager.getAssetsManagerDAO(),
    contractManager.getChronoBankPlatformDAO(),
    contractManager.getPlatformTokenExtensionGatewayManagerEmitterDAO(),
  ])
  const issueCallback = async (symbol, value, isIssue, tx) => {
    const { assets } = getState().get(DUCK_ASSETS_MANAGER)
    const newAssets = await assetsManagerDao.getSystemAssetsForOwner(account)
    Object.keys(assets).map((address) => {
      if (!newAssets[ address ]) {
        newAssets[ address ] = assets[ address ]
      }
    })
    dispatch({
      type: SET_ASSETS,
      payload: {
        assets: newAssets,
      },
    })

    dispatch(setTx(tx))
  }
  const managersCallback = (tx) => {
    dispatch(setManagers(tx))
    if (tx.args.from !== account && tx.args.to !== account) {
      return
    }
    dispatch(setTx(tx))
  }
  const assetCallback = async (tx) => {
    const assets = await assetsManagerDao.getSystemAssetsForOwner(account)
    const erc20: ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
    await erc20.fetchTokens([ tx.args.token ])
    let removedToken = new TokenModel()
    dispatch({ type: TOKENS_REMOVE, token: removedToken.transactionHash(tx.transactionHash) })
    dispatch({ type: SET_ASSETS, payload: { assets } })
    dispatch(setTx(tx))
  }

  return Promise.all([
    chronoBankPlatformDAO.watchIssue(issueCallback),
    chronoBankPlatformDAO.watchRevoke(issueCallback),
    chronoBankPlatformDAO.watchManagers(managersCallback),
    platformTokenExtensionGatewayManagerEmitterDAO.watchAssetCreate(assetCallback, account),
  ])
}

export const getFee = async (token: TokenModel) => {
  let tokenFee = token.fee()
    .withFee(false)
    .isFetching(false)
    .isFetched(true)

  try {
    const feeInterfaceDAO = await contractManager.getFeeInterfaceDAO(token.address())
    const res = await feeInterfaceDAO.getFeePercent()
    tokenFee = tokenFee
      .fee(res / 100)
      .withFee(!!res.toNumber())

  } catch (e) {
    // eslint-disable-next-line
    console.log(e.message)
  }
  return tokenFee
}

export const selectToken = (token: TokenModel) => async (dispatch, getState) => {
  const { assets } = getState().get(DUCK_ASSETS_MANAGER)
  dispatch({
    type: SELECT_TOKEN,
    payload: { symbol: token.id() },
  })
  dispatch({
    type: TOKENS_FETCHED,
    token: token
      .managersList(new OwnerCollection().isFetching(true))
      .fee(token.fee().isFetching(true))
      .isReissuable(token.isReissuable().isFetching(true)),
  })

  const [ managersList, isReissuable, fee ] = await Promise.all([
    getManagersForAssetSymbol(token.symbol()),
    checkIsReissuable(token, assets[ token.address() ]),
    getFee(token),
  ])

  dispatch({
    type: TOKENS_FETCHED,
    token: token
      .managersList(managersList)
      .isReissuable(isReissuable)
      .fee(fee),
  })

}
