/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import Amount from '@chronobank/core/models/Amount'
import { ASSET_TOPICS } from '@chronobank/core/describers/topics'
import { loadEvents } from '@chronobank/core/redux/events/actions'
import { notify } from '../notifier/actions'
import web3Converter from '../../utils/Web3Converter'
import ReissuableModel from '../../models/tokens/ReissuableModel'
import TokenModel from '../../models/tokens/TokenModel'
import OwnerCollection from '../../models/wallet/OwnerCollection'
import OwnerModel from '../../models/wallet/OwnerModel'
import {
  DUCK_TOKENS,
  TOKENS_FETCHED,
  TOKENS_UPDATE,
} from '../tokens/constants'

import AssetsManagerNoticeModel, {
  ASSET_PAUSED,
  ASSET_UNPAUSED,
  MANAGER_ADDED,
  MANAGER_REMOVED,
  USER_ADDED_TO_BLACKLIST,
  USER_DELETED_FROM_BLACKLIST,
} from '../../models/notices/AssetsManagerNoticeModel'
import PausedModel from '../../models/tokens/PausedModel'
import BlacklistModel from '../../models/tokens/BlacklistModel'
import { daoByType } from '../daos/selectors'
import { web3Selector } from '../ethereum/selectors'
import { executeTransaction } from '../ethereum/thunks'
import assetsManagerService from '../../services/AssetsManagerService'

import { EVENT_PLATFORM_REQUESTED } from '../../dao/constants/PlatformsManagerDAO'

import {
  DUCK_ASSETS_MANAGER,
  GET_ASSET_DATA,
  GET_ASSETS_MANAGER_COUNTS,
  GET_ASSETS_MANAGER_COUNTS_START,
  GET_PLATFORMS,
  MIDDLEWARE_EVENT_PAUSED,
  MIDDLEWARE_EVENT_RESTRICTED,
  MIDDLEWARE_EVENT_UNPAUSED,
  MIDDLEWARE_EVENT_UNRESTRICTED,
  SELECT_PLATFORM,
  SELECT_TOKEN,
  SET_ASSETS,
} from './constants'
import { DAOS_REGISTER } from '../daos/constants'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { TOKEN_MANAGEMENT_EXTENSION_LIBRARY } from '../../dao/ContractList'
import { getAccount } from '../session/selectors/models'
import { TX_ISSUE, TX_OWNERSHIP_CHANGE, TX_REVOKE } from '../../dao/constants/ChronoBankPlatformDAO'

// eslint-disable-next-line
export const setTxFromMiddlewareForBlackList = (address, symbol) => async (dispatch, getState) => {
  // const state = getState()
  // const account = getAccount(state)
  // const assetsManagerDAO = daoByType('AssetsManager')(state)
  // const transactionsList = await assetsManagerDAO.getTransactionsForBlacklists(address, symbol, account)

  // dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

// eslint-disable-next-line
export const setTxFromMiddlewareForBlockAsset = (address, symbol) => async (dispatch, getState) => {
  // const state = getState()
  // const account = getAccount(state)
  // const assetsManagerDAO = daoByType('AssetsManager')(state)
  // const transactionsList = await assetsManagerDAO.getTransactionsForBlockAsset(address, symbol, account)

  // dispatch({ type: GET_TRANSACTIONS_DONE, payload: { transactionsList } })
}

export const getAssetsManagerData = () => async (dispatch, getState) => {
  dispatch({ type: GET_ASSETS_MANAGER_COUNTS_START })
  const state = getState()
  const account = getAccount(state)
  const assetsManagerDAO = daoByType('AssetsManager')(state)

  const platforms = await assetsManagerDAO.getPlatformList(account)
  const assets = await assetsManagerDAO.getSystemAssetsForOwner(account)
  const managers = await assetsManagerDAO.getManagers(Object.entries(assets).map((item) => item[1].symbol), [account])
  const usersPlatforms = platforms.filter((platform) => platform.by === account)

  Object.values(assets).forEach((asset) => {
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
  const state = getState()
  const account = getAccount(state)
  const assetsManagerDAO = daoByType('AssetsManager')(state)

  const asset = await assetsManagerDAO.getAssetDataBySymbol(symbol)
  if (asset.by === account) {
    dispatch(setTxFromMiddlewareForBlockAsset(asset.token, symbol))
    dispatch(setTxFromMiddlewareForBlackList(asset.token, symbol))
    dispatch({ type: GET_ASSET_DATA, asset })
  }
}

export const getPlatforms = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const assetsManagerDAO = daoByType('AssetsManager')(state)

  const platforms = await assetsManagerDAO.getPlatformList(account)
  const usersPlatforms = platforms.filter((platform) => platform.by === account)
  dispatch({ type: GET_PLATFORMS, payload: { platforms, usersPlatforms } })
}

export const createPlatform = (values) => async (dispatch, getState) => {
  try {
    const dao = daoByType('PlatformsManager')(getState())
    let tx
    if (values.get('alreadyHave')) {
      tx = await dao.attachPlatform(values.get('platformAddress'))
    } else {
      tx = await dao.createPlatform()
    }

    const web3 = web3Selector()(getState())
    if (tx) {
      await dispatch(executeTransaction({ tx, web3, options: { feeMultiplier: 1 } }))
    }
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

/**
 *
 * @param platform
 * @returns {Function}
 */
export const detachPlatform = (platform) => async (dispatch, getState) => {
  const assetsManagerDAO = daoByType('AssetsManager')(getState())
  const result = await assetsManagerDAO.detachPlatform(platform)

  if (result) {
    dispatch(getPlatforms())
  }
}

/**
 *
 * @returns {Function}
 */
export const watchPlatformManager = () => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const platformsManagerDAO = daoByType('PlatformsManager')(state)

  const callback = (tx) => {
    dispatch(setTx(tx))
  }

  platformsManagerDAO.on(EVENT_PLATFORM_REQUESTED, (data) => {
    if (data.returnValues.by.toLowerCase() !== account) {
      return
    }

    const assetsManager = getState().get(DUCK_ASSETS_MANAGER)
    const platforms = assetsManager.platformsList()
    platforms.push({
      address: data.returnValues.platform.toLowerCase(),
      by: data.returnValues.by.toLowerCase(),
      name: null,
    })

    const usersPlatforms = platforms.filter((platform) => platform.by === account)
    dispatch({ type: GET_PLATFORMS, payload: { platforms, usersPlatforms } })
  })
  platformsManagerDAO.watchCreatePlatform(callback, account)
}

/**
 *
 * @param token
 * @returns {Function}
 */
export const createAsset = (token: TokenModel) => async (dispatch, getState) => {
  try {

    let tx
    const platformsManagerDAO = daoByType('PlatformsManager')(getState())
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    const tokenExtensionAddress = await assetsManagerDAO.getTokenExtension(token.platform().address)

    const tokenManagementExtension =
      await platformsManagerDAO.tokenManagementExtensionManager.getTokenManagementExtensionDAO(tokenExtensionAddress)

    await dispatch({
      type: DAOS_REGISTER,
      model: new ContractDAOModel({
        contract: TOKEN_MANAGEMENT_EXTENSION_LIBRARY,
        address: tokenManagementExtension.address.toLowerCase(),
        dao: tokenManagementExtension,
      }),
    })

    if (token.withFee()) {
      tx = await tokenManagementExtension.createAssetWithFee(token)
    } else {
      tx = await tokenManagementExtension.createAssetWithoutFee(token)
    }

    if (tx) {
      await dispatch(executeTransaction({ tx, options: { feeMultiplier: 1 } }))
    }

    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
    // @todo remove uuid. Wait new tx flow and parse event for this
    const txHash = uuid()
    assets[txHash] = {
      address: txHash,
      platform: token.platform().address,
      totalSupply: token.totalSupply(),
      symbol: token.symbol(),
    }

    await dispatch({
      type: TOKENS_UPDATE,
      token: token
        .isPending(true)
        .transactionHash(txHash),
    })
    await dispatch({ type: SET_ASSETS, payload: { assets } })
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

/**
 *
 * @param symbol
 * @param excludeAccounts
 * @returns {Promise<*>}
 */
export const getManagersForAssetSymbol = (symbol: string, excludeAccounts: Array<string> = []) => async (dispatch, getState) => {
  try {
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    const managersList = await assetsManagerDAO.getManagersForAssetSymbol(symbol, excludeAccounts)
    return managersList.isFetched(true)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e)
    return new OwnerCollection()
  }
}

/**
 *
 * @param token
 * @param owner
 * @returns {Function}
 */
export const removeManager = (token: TokenModel, owner: string) => async (dispatch, getState) => {
  try {
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
    const platform = token.platform() && token.platform().address || assets[token.address()].platform
    const chronoBankPlatformDAO = await assetsManagerService.getChronoBankPlatformDAO(platform)
    const tx = chronoBankPlatformDAO.removeAssetPartOwner(token.symbol(), owner)
    if (tx) {
      await dispatch(executeTransaction({ tx }))
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

/**
 *
 * @param token
 * @param owner
 * @returns {Function}
 */
export const addManager = (token: TokenModel, owner: string) => async (dispatch, getState) => {
  try {
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
    const platform = token.platform() && token.platform().address || assets[token.address()].platform
    const chronoBankPlatformDAO = assetsManagerService.getChronoBankPlatformDAO(platform)
    const tx = chronoBankPlatformDAO.addAssetPartOwner(token.symbol(), owner)
    if (tx) {
      await dispatch(executeTransaction({ tx }))
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const reissueAsset = (token: TokenModel, amount: number) => async (dispatch, getState) => {
  try {
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
    const platform = token.platform() && token.platform().address || assets[token.address()].platform
    const chronoBankPlatformDAO = assetsManagerService.getChronoBankPlatformDAO(platform)
    const tx = chronoBankPlatformDAO.reissueAsset(token, amount)

    if (tx) {
      await dispatch(executeTransaction({ tx }))
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const revokeAsset = (token: TokenModel, amount: number) => async (dispatch, getState) => {
  try {
    const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
    const platform = token.platform() && token.platform().address || assets[token.address()].platform
    const chronoBankPlatformDAO = assetsManagerService.getChronoBankPlatformDAO(platform)
    const tx = chronoBankPlatformDAO.revokeAsset(token, amount)

    if (tx) {
      await dispatch(executeTransaction({ tx }))
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const checkIsReissuable = async (token: TokenModel, asset) => {
  try {
    const chronoBankPlatformDAO = assetsManagerService.getChronoBankPlatformDAO(asset.platform)
    const isReissuable = await chronoBankPlatformDAO.isReissuable(token.symbol())
    return new ReissuableModel({ value: isReissuable }).isFetched(true)
  } catch (e) {
    // eslint-disable-next-line
    console.warn(e.message)
    return new ReissuableModel({ value: false }).isFetched(true)
  }
}

export const setTx = (tx) => async (dispatch, getState) => {
  const state = getState()
  const account = getAccount(state)
  const assetsManagerDAO = daoByType('AssetsManager')(state)
  // eslint-disable-next-line
  const txModel = await assetsManagerDAO.getTxModel(tx, account)
}

export const setManagers = (tx) => async (dispatch, getState) => {
  try {
    const state = getState()
    const symbol = web3Converter.bytesToString(tx.returnValues.symbol)
    const account = getAccount(state)

    const selectedToken = state.get(DUCK_ASSETS_MANAGER).selectedToken()
    const tokens = state.get(DUCK_TOKENS)
    const token = tokens.getBySymbol(symbol)

    if (tx.returnValues.from === account) {
      if (selectedToken === symbol) {
        dispatch({ type: SELECT_TOKEN, payload: { selectedToken: null } })
      }
      dispatch(getAssetDataBySymbol(symbol))
    } else {
      let notice
      const { from, to } = tx.returnValues
      const assetsManagerDAO = daoByType('AssetsManager')(state)
      if (token && token.managersList().isFetched()) {
        let managersList = token.managersList()
        if (assetsManagerDAO.isEmptyAddress(from)) {
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
    console.log(e.message)
  }
}

export const watchInitTokens = () => async (dispatch, getState) => {
  await dispatch(getAssetsManagerData())

  const state = getState()
  const account = getAccount(state)
  const tokens = state.get(DUCK_TOKENS)

  dispatch(loadEvents(ASSET_TOPICS, account))

  assetsManagerService.setPlatformTokenExtensionGatewayManagerEmitterDAO(daoByType('PlatformTokenExtensionGatewayManagerEmitterDAO')(state))
  await Promise.all([
    dispatch(subscribeToBlockAssetEvents()),
    dispatch(subscribeToRestrictedEvents()),
  ])

  const revokeCallback = async (data) => {
    const tokenSymbol = web3Converter.bytesToString(data.returnValues.symbol)
    const token = tokens.getBySymbol(tokenSymbol)
    const totalSupply = token.totalSupply() + token.removeDecimals(new Amount(data.returnValues.value, tokenSymbol))

    await dispatch({
      type: TOKENS_UPDATE,
      token: token
        .totalSupply(totalSupply),
    })

    dispatch(setTx(data))
  }

  const issueCallback = async (data) => {
    const tokenSymbol = web3Converter.bytesToString(data.returnValues.symbol)
    const token = tokens.getBySymbol(tokenSymbol)
    const totalSupply = token.totalSupply() - token.removeDecimals(new Amount(data.returnValues.value, tokenSymbol))

    await dispatch({
      type: TOKENS_UPDATE,
      token: token
        .totalSupply(totalSupply),
    })

    dispatch(setTx(data))
  }
  const managersCallback = (tx) => {
    dispatch(setManagers(tx))
    if (tx.returnValues.from !== account && tx.returnValues.to !== account) {
      return
    }
    dispatch(setTx(tx))
  }
  const assetCallback = async (data) => {
    const assetList = getState().get(DUCK_ASSETS_MANAGER).assets()
    const tokens = getState().get(DUCK_TOKENS)
    const eventSymbol = web3Converter.bytesToString(data.returnValues.symbol)

    const updateToken = tokens.list().find((t) => t.symbol() === eventSymbol)
    await dispatch({
      type: TOKENS_UPDATE,
      token: updateToken
        .isFetching(false)
        .isFetched(true)
        .isPending(false)
        .setAddress(data.returnValues.self.toLowerCase())
        .transactionHash(null),
    })

    const assets = {}
    Object.entries(assetList).filter(([, asset]) => {
      return asset.symbol !== eventSymbol
    }).forEach(([key, value]) => {
      assets[key] = value
    })

    assets[data.returnValues.self.toLowerCase()] = {
      self: data.returnValues.self.toLowerCase(),
      by: data.returnValues.by.toLowerCase(),
      event: data.event,
      includedIn: {
        blockNumber: data.blockNumber,
        logIndex: data.logIndex,
        txIndex: data.txIndex,
      },
      address: data.returnValues.self.toLowerCase(),
      platform: data.returnValues.platform.toLowerCase(),
      symbol: data.returnValues.symbol,
      token: data.returnValues.token.toLowerCase(),
      totalSupply: +updateToken.totalSupply(),
    }

    dispatch({ type: SET_ASSETS, payload: { assets } })
  }

  const platforms = state.get(DUCK_ASSETS_MANAGER).get('usersPlatforms')
  platforms.forEach(({ address }) => {
    assetsManagerService
      .subscribeToChronoBankPlatformDAO(address)
  })

  assetsManagerService
    .on(TX_ISSUE, issueCallback)
    .on(TX_REVOKE, revokeCallback)
    .on(TX_OWNERSHIP_CHANGE, managersCallback)

  assetsManagerService.subscribeToAssets(assetCallback, account)
}

export const getFee = (token: TokenModel) => async (dispatch, getState) => {
  let tokenFee = token.fee()
    .withFee(false)
    .isFetching(false)
    .isFetched(true)

  try {
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    const feeInterfaceDAO = await assetsManagerDAO.getFeeInterfaceDAO(token.address())
    const res = await feeInterfaceDAO.getFeePercent()
    tokenFee = tokenFee
      .fee(res / 100)
      .withFee(!!res.toNumber())
  } catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
  return tokenFee
}

export const selectToken = (token: TokenModel) => async (dispatch, getState) => {
  const state = getState()
  const assets = state.get(DUCK_ASSETS_MANAGER).assets()
  const account = getAccount(state)
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

  const [managersList, isReissuable, fee, isPaused, blacklist] = await Promise.all([
    dispatch(getManagersForAssetSymbol(web3Converter.stringToBytesWithZeros(token.symbol()), [account])),
    checkIsReissuable(token, assets[token.address()]),
    dispatch(getFee(token)),
    dispatch(getPauseStatus(token.address())),
    dispatch(getBlacklist(token.symbol())),
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

const getPauseStatus = (address: string) => async (dispatch, getState) => {
  let isPaused = false
  try {
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    const chronoBankAssetDAO = await assetsManagerDAO.getChronoBankAssetDAO(address)
    isPaused = await chronoBankAssetDAO.getPauseStatus()
  } catch (e) {
    // eslint-disable-next-line
    console.log(e.message)
  }
  return new PausedModel({ value: isPaused }).isFetched(true)
}

export const changePauseStatus = (token: TokenModel, statusIsBlock: boolean) => async (dispatch, getState) => {
  const pause = new PausedModel({ value: statusIsBlock })
  dispatch({
    type: TOKENS_FETCHED,
    token: token.isPaused(pause.isFetched(false).isFetching(true)),
  })
  try {
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    const chronoBankAssetDAO = await assetsManagerDAO.getChronoBankAssetDAO(token.address())
    const tx = statusIsBlock
      ? chronoBankAssetDAO.pause() // status === true -> block
      : chronoBankAssetDAO.unpause() // status === false -> unblock

    if (tx) {
      await dispatch(executeTransaction({ tx }))
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

const getBlacklist = (symbol: string) => async (disptch, getState) => {
  let blacklist = new BlacklistModel()
  try {
    const assetsManagerDAO = daoByType('AssetsManager')(getState())
    blacklist = await assetsManagerDAO.getBlacklist(symbol)
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
  return blacklist.isFetched(true)
}

export const restrictUser = (token: TokenModel, address: string) => async (dispatch, getState): boolean => {
  const assetsManagerDAO = daoByType('AssetsManager')(getState())
  const chronoBankAssetDAO = await assetsManagerDAO.getChronoBankAssetDAO(token.address())
  const tx = chronoBankAssetDAO.restrict([address])
  if (tx) {
    await dispatch(executeTransaction({ tx }))
  }
}

export const unrestrictUser = (token: TokenModel, address: string) => async (dispatch, getState): boolean => {
  const assetsManagerDAO = daoByType('AssetsManager')(getState())
  const chronoBankAssetDAO = await assetsManagerDAO.getChronoBankAssetDAO(token.address())
  const tx = chronoBankAssetDAO.unrestrict([address])
  if (tx) {
    await dispatch(executeTransaction({ tx }))
  }
}

export const selectPlatform = (platformAddress) => async (dispatch, getState) => {
  const assets = getState().get(DUCK_ASSETS_MANAGER).assets()
  const tokens = getState().get(DUCK_TOKENS)
  dispatch({ type: SELECT_PLATFORM, payload: { platformAddress } })

  const promises = []
  const calledAssets = []
  Object.values(assets).forEach((asset) => {
    if (asset.platform === platformAddress) {
      promises.push(dispatch(getPauseStatus(asset.address)))
      calledAssets.push(asset)
    }
  })

  const pauseResult = await Promise.all(promises)
  calledAssets.forEach((asset, i) => {
    const token = tokens.getByAddress(asset.address)
    if (token.address()) {
      dispatch({
        type: TOKENS_FETCHED,
        token: token.isPaused(pauseResult[i]),
      })
    }
  })
}

const subscribeToRestrictedEvents = () => async (dispatch, getState) => {
  const state = getState()
  const assetsManagerDAO = daoByType('AssetsManager')(state)
  const callback = async (data, status) => {
    const address = status ? data.payload.restricted : data.payload.unrestricted
    const symbol = web3Converter.bytesToString(data.payload.symbol)
    const token = getState().get(DUCK_TOKENS).item(symbol)
    dispatch(setTxFromMiddlewareForBlackList(token.address(), token.symbol()))
    if (token.isFetched()) {
      const blacklist = await dispatch(getBlacklist(token.symbol()))
      dispatch({
        type: TOKENS_FETCHED,
        token: token.blacklist(blacklist),
      })
      dispatch(notify(new AssetsManagerNoticeModel({ status: status ? USER_ADDED_TO_BLACKLIST : USER_DELETED_FROM_BLACKLIST, replacements: { address } })))
    }
  }

  assetsManagerDAO.subscribeOnMiddleware(MIDDLEWARE_EVENT_RESTRICTED, (data) => callback(data, true))
  assetsManagerDAO.subscribeOnMiddleware(MIDDLEWARE_EVENT_UNRESTRICTED, (data) => callback(data, false))
}

const subscribeToBlockAssetEvents = () => async (dispatch, getState) => {
  const state = getState()
  const assetsManagerDAO = daoByType('AssetsManager')(state)
  const callback = (data, status) => {
    const isPaused = new PausedModel({ value: status })
    const symbol = web3Converter.bytesToString(data.payload.symbol)
    const token = state.get(DUCK_TOKENS).item(symbol)
    dispatch(setTxFromMiddlewareForBlockAsset(token.address(), token.symbol()))
    if (token.isFetched()) {
      dispatch({
        type: TOKENS_FETCHED,
        token: token.isPaused(isPaused.isFetched(true)),
      })
      dispatch(notify(new AssetsManagerNoticeModel({ status: status ? ASSET_PAUSED : ASSET_UNPAUSED, replacements: { symbol } })))
    }
  }

  assetsManagerDAO.subscribeOnMiddleware(MIDDLEWARE_EVENT_PAUSED, (data) => callback(data, true))
  assetsManagerDAO.subscribeOnMiddleware(MIDDLEWARE_EVENT_UNPAUSED, (data) => callback(data, false))
}
