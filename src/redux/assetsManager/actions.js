import Immutable from 'immutable'
import { notify } from 'redux/notifier/actions'
import web3Converter from 'utils/Web3Converter'
import contractManager from 'dao/ContractsManagerDAO'
import ReissuableModel from 'models/tokens/ReissuableModel'
import TokenModel from 'models/tokens/TokenModel'
import OwnerCollection from 'models/wallet/OwnerCollection'
import OwnerModel from 'models/wallet/OwnerModel'
import {
  MIDDLEWARE_EVENT_ISSUE,
  MIDDLEWARE_EVENT_PLATFORM_REQUESTED,
  MIDDLEWARE_EVENT_REVOKE,
  MIDDLEWARE_EVENT_RESTRICTED,
  MIDDLEWARE_EVENT_UNRESTRICTED,
  MIDDLEWARE_EVENT_PAUSED,
  MIDDLEWARE_EVENT_UNPAUSED,
} from 'dao/AssetsManagerDAO'
import { DUCK_SESSION } from 'redux/session/actions'
import { DUCK_TOKENS, TOKENS_FETCHED, TOKENS_UPDATE } from 'redux/tokens/actions'
import AssetsManagerNoticeModel, {
  ASSET_PAUSED,
  ASSET_UNPAUSED,
  MANAGER_ADDED,
  MANAGER_REMOVED,
  USER_ADDED_TO_BLACKLIST,
  USER_DELETED_FROM_BLACKLIST,
} from 'models/notices/AssetsManagerNoticeModel'
import PausedModel from 'models/tokens/PausedModel'
import BlacklistModel from 'models/tokens/BlacklistModel'

export const DUCK_ASSETS_MANAGER = 'assetsManager'

export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const SET_ASSETS = 'AssetsManager/SET_ASSETS'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'
export const GET_ASSETS_MANAGER_COUNTS_START = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS_START'
export const GET_ASSET_DATA = 'AssetsManager/GET_ASSET_DATA'
export const SELECT_TOKEN = 'AssetsManager/SELECT_TOKEN'
export const SELECT_PLATFORM = 'AssetsManager/SELECT_PLATFORM'
export const GET_TRANSACTIONS_START = 'AssetsManager/GET_TRANSACTIONS_START'
export const GET_TRANSACTIONS_DONE = 'AssetsManager/GET_TRANSACTIONS_DONE'
export const SET_NEW_MANAGERS_LIST = 'AssetsManager/SET_NEW_MANAGERS_LIST'

export const setTxFromMiddlewareForBlackList = (address, symbol) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const transactionsList = await assetsManagerDAO.getTransactionsForBlacklists(address, symbol, account)

  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

export const setTxFromMiddlewareForBlockAsset = (address, symbol) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const transactionsList = await assetsManagerDAO.getTransactionsForBlockAsset(address, symbol, account)

  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS_START })
  const { account } = getState().get(DUCK_SESSION)

  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getPlatformList(account)
  const assets = await assetsManagerDao.getSystemAssetsForOwner(account)
  const managers = await assetsManagerDao.getManagers(Object.entries(assets).map((item) => item[ 1 ].symbol), [ account ])
  const usersPlatforms = platforms.filter((platform) => platform.by === account)

  Object.values(assets).map((asset) => {
    const symbol = web3Converter.bytesToString(asset.symbol)
    dispatch(setTxFromMiddlewareForBlockAsset(asset.address, symbol))
    dispatch(setTxFromMiddlewareForBlackList(asset.address, symbol))
  })
  dispatch({
    type: GET_ASSETS_MANAGER_COUNTS, payload: {
      platforms,
      assets,
      managers,
      usersPlatforms,
    },
  })
}

export const getAssetDataBySymbol = (symbol) => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const asset = await assetsManagerDao.getAssetDataBySymbol(symbol)
  if (asset.by === account) {
    dispatch(setTxFromMiddlewareForBlockAsset(asset.token, symbol))
    dispatch(setTxFromMiddlewareForBlackList(asset.token, symbol))
    dispatch({ type: GET_ASSET_DATA, asset })
  }
}

export const getPlatforms = () => async (dispatch, getState) => {
  const { account } = getState().get(DUCK_SESSION)
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const platforms = await assetsManagerDao.getPlatformList(account)
  const usersPlatforms = platforms.filter((platform) => platform.by === account)
  dispatch({ type: GET_PLATFORMS, payload: { platforms, usersPlatforms } })
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
    let assets = getState().get(DUCK_ASSETS_MANAGER).assets()
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

export const getManagersForAssetSymbol = async (symbol: string, excludeAccounts: Array<string> = []) => {
  const assetsManagerDAO = await contractManager.getAssetsManagerDAO()
  const managersList = await assetsManagerDAO.getManagersForAssetSymbol(symbol, excludeAccounts)
  return managersList.isFetched(true)
}

export const removeManager = (token: TokenModel, owner: string) => async (dispatch, getState) => {
  try {
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
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
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
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
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
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
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
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
  dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList: new Immutable.Map().set(txModel.id(), txModel) } })
}

export const setManagers = (tx) => async (dispatch, getState) => {
  try {
    const symbol = web3Converter.bytesToString(tx.args.symbol)
    const { account } = getState().get(DUCK_SESSION)

    let selectedToken = getState().get(DUCK_ASSETS_MANAGER).selectedToken()
    const tokens = getState().get(DUCK_TOKENS)
    let token = tokens.getBySymbol(symbol)

    if (tx.args.from === account) {
      if (selectedToken === symbol) {
        dispatch({ type: SELECT_TOKEN, payload: { selectedToken: null } })
      }
      dispatch(getAssetDataBySymbol(symbol))
    } else {
      let notice
      const { from, to } = tx.args
      const assetsManagerDao = await contractManager.getAssetsManagerDAO()
      if (token && token.managersList().isFetched()) {
        let managersList = token.managersList()
        if (assetsManagerDao.isEmptyAddress(from)) {
          managersList = managersList.add(new OwnerModel({ address: to }))
          notice = new AssetsManagerNoticeModel({ status: MANAGER_ADDED, transactionHash: tx.transactionHash })
        } else {
          managersList = managersList.remove(new OwnerModel({ address: from }))
          notice = new AssetsManagerNoticeModel({ status: MANAGER_REMOVED, transactionHash: tx.transactionHash })
        }
        dispatch(notify(notice))
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
  dispatch(getTransactions())
  const { account } = getState().get(DUCK_SESSION)
  const [ , chronoBankPlatformDAO, platformTokenExtensionGatewayManagerEmitterDAO ] = await Promise.all([
    contractManager.getAssetsManagerDAO(),
    contractManager.getChronoBankPlatformDAO(),
    contractManager.getPlatformTokenExtensionGatewayManagerEmitterDAO(),
    dispatch(subscribeToBlockAssetEvents()),
    dispatch(subscribeToRestrictedEvents()),
    dispatch(subscribeToAssetEvents(account)),
  ])

  const issueCallback = async (tx) => dispatch(setTx(tx))
  const managersCallback = (tx) => {
    dispatch(setManagers(tx))
    if (tx.args.from !== account && tx.args.to !== account) {
      return
    }
    dispatch(setTx(tx))
  }
  const assetCallback = async (tx) => {
    const state = getState().get(DUCK_ASSETS_MANAGER)
    const assets = state.assets()
    delete assets[ tx.transactionHash ]
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
  const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
  const { account } = getState().get(DUCK_SESSION)
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

  const [ managersList, isReissuable, fee, isPaused, blacklist ] = await Promise.all([
    getManagersForAssetSymbol(web3Converter.stringToBytesWithZeros(token.symbol()), [ account ]),
    checkIsReissuable(token, assets[ token.address() ]),
    getFee(token),
    getPauseStatus(token.address()),
    getBlacklist(token.symbol()),
  ])

  dispatch({
    type: TOKENS_FETCHED,
    token: token
      .managersList(managersList)
      .isReissuable(isReissuable)
      .fee(fee)
      .isPaused(isPaused)
      .blacklist(blacklist),
  })
}

const getPauseStatus = async (address: string) => {
  let isPaused = false
  try {
    const chronoBankAssetDAO = await contractManager.getChronoBankAssetDAO(address)
    isPaused = await chronoBankAssetDAO.getPauseStatus()
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
  return new PausedModel({ value: isPaused }).isFetched(true)
}

export const changePauseStatus = (token: TokenModel, statusIsBlock: boolean) => async (dispatch) => {
  const pause = new PausedModel({ value: statusIsBlock })
  dispatch({
    type: TOKENS_FETCHED,
    token: token.isPaused(pause.isFetched(false).isFetching(true)),
  })
  try {
    const chronoBankAssetDAO = await contractManager.getChronoBankAssetDAO(token.address())
    const tx = statusIsBlock
      ? await chronoBankAssetDAO.pause() // status === true -> block
      : await chronoBankAssetDAO.unpause() // status === false -> unblock
    if (tx.tx) {
      dispatch({
        type: TOKENS_FETCHED,
        token: token.isPaused(pause.isFetched(false).isFetching(true)),
      })
    }
  } catch (e) { // if error
    // eslint-disable-next-line
    console.error('e', e.message)
    dispatch({
      type: TOKENS_FETCHED,
      token: token.isPaused(pause.value(!statusIsBlock).isFetched(true).isFetching(false)),
    })
  }
}

const getBlacklist = async (symbol: string) => {
  let blacklist = new BlacklistModel()
  try {
    const assetsManagerDao = await contractManager.getAssetsManagerDAO()
    blacklist = await assetsManagerDao.getBlacklist(symbol)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }

  return blacklist.isFetched(true)
}

export const restrictUser = (token: TokenModel, address: string) => async (dispatch): boolean => {
  const chronoBankAssetDAO = await contractManager.getChronoBankAssetDAO(token.address())
  const tx = await chronoBankAssetDAO.restrict([ address ])
  if (tx.tx) {
    dispatch({
      type: TOKENS_FETCHED,
      token: token.blacklist(token.blacklist().add(address)),
    })
  }
}

export const unrestrictUser = (token: TokenModel, address: string) => async (dispatch): boolean => {
  const chronoBankAssetDAO = await contractManager.getChronoBankAssetDAO(token.address())
  const tx = await chronoBankAssetDAO.unrestrict([ address ])
  if (tx.tx) {
    dispatch({
      type: TOKENS_FETCHED,
      token: token.blacklist(token.blacklist().delete(address)),
    })
  }
}

export const selectPlatform = (platformAddress) => async (dispatch, getState) => {
  const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
  const tokens = getState().get(DUCK_TOKENS)
  dispatch({ type: SELECT_PLATFORM, payload: { platformAddress } })

  let promises = []
  let calledAssets = []
  Object.values(assets).map((asset) => {
    if (asset.platform === platformAddress) {
      promises.push(getPauseStatus(asset.address))
      calledAssets.push(asset)
    }
  })

  const pauseResult = await Promise.all(promises)
  calledAssets.map((asset, i) => {
    const token = tokens.getByAddress(asset.address)
    if (token.address()) {
      dispatch({
        type: TOKENS_FETCHED,
        token: token.isPaused(pauseResult[ i ]),
      })
    }
  })
}

const subscribeToAssetEvents = (account: string) => async (dispatch) => {
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()

  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_PLATFORM_REQUESTED, (data) => {
    if (data && data.payload && data.payload.by !== account) {
      return
    }
    dispatch(getPlatforms())
  })

  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_ISSUE, (data) => {
    if (data.payload.symbol) {
      dispatch(getAssetDataBySymbol(web3Converter.bytesToString(data.payload.symbol)))
    }
  })

  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_REVOKE, (data) => {
    if (data.payload.symbol) {
      dispatch(getAssetDataBySymbol(web3Converter.bytesToString(data.payload.symbol)))
    }
  })
}

const subscribeToRestrictedEvents = () => async (dispatch, getState) => {
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const callback = async (data, status) => {
    const address = status ? data.payload.restricted : data.payload.unrestricted
    const symbol = web3Converter.bytesToString(data.payload.symbol)
    const token = getState().get(DUCK_TOKENS).item(symbol)
    dispatch(setTxFromMiddlewareForBlackList(token.address(), token.symbol()))
    if (token.isFetched()) {
      const blacklist = await getBlacklist(token.symbol())
      dispatch({
        type: TOKENS_FETCHED,
        token: token.blacklist(blacklist),
      })
      dispatch(notify(new AssetsManagerNoticeModel({ status: status ? USER_ADDED_TO_BLACKLIST : USER_DELETED_FROM_BLACKLIST, replacements: { address } })))
    }
  }

  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_RESTRICTED, (data) => callback(data, true))
  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_UNRESTRICTED, (data) => callback(data, false))
}

const subscribeToBlockAssetEvents = () => async (dispatch, getState) => {
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const callback = (data, status) => {
    const isPaused = new PausedModel({ value: status })
    const symbol = web3Converter.bytesToString(data.payload.symbol)
    const token = getState().get(DUCK_TOKENS).item(symbol)
    dispatch(setTxFromMiddlewareForBlockAsset(token.address(), token.symbol()))
    if (token.isFetched()) {
      dispatch({
        type: TOKENS_FETCHED,
        token: token.isPaused(isPaused.isFetched(true)),
      })
      dispatch(notify(new AssetsManagerNoticeModel({ status: status ? ASSET_PAUSED : ASSET_UNPAUSED, replacements: { symbol } })))
    }

  }

  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_PAUSED, (data) => callback(data, true))
  assetsManagerDao.subscribeOnMiddleware(MIDDLEWARE_EVENT_UNPAUSED, (data) => callback(data, false))
}
