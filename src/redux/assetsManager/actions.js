import contractManager from 'dao/ContractsManagerDAO'
import Web3Converter from 'utils/Web3Converter'
import TokenModel from '../../models/TokenModel'
import TxModel from '../../models/TxModel'
import web3Provider from 'network/Web3Provider'
import BigNumber from 'bignumber.js'

export const GET_PLATFORMS_COUNT = 'AssetsManager/GET_PLATFORMS_COUNT'
export const GET_PLATFORMS = 'AssetsManager/GET_PLATFORMS'
export const GET_TOKENS = 'AssetsManager/GET_TOKENS'
export const GET_ASSETS_MANAGER_COUNTS = 'AssetsManager/GET_ASSETS_MANAGER_COUNTS'
export const GET_MANAGERS_FOR_TOKEN = 'AssetsManager/GET_MANAGERS_FOR_TOKEN'
export const SELECT_TOKEN = 'AssetsManager/SELECT_TOKEN'
export const SELECT_PLATFORM = 'AssetsManager/SELECT_PLATFORM'
export const GET_MANAGERS_FOR_TOKEN_LOADING = 'AssetsManager/GET_MANAGERS_FOR_TOKEN_LOADING'
export const SET_WATCHERS = 'AssetsManager/SET_WATCHERS'
export const SET_TOTAL_SUPPLY = 'AssetsManager/SET_TOTAL_SUPPLY'
export const GET_TRANSACTIONS = 'AssetsManager/GET_TRANSACTIONS'

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
  const account = getState().get('session').account
  const assetsManagerDao = await contractManager.getAssetsManagerDAO()
  const ERC20ManagerDAO = await contractManager.getERC20ManagerDAO()
  const assets = await assetsManagerDao.getAssetsForOwner(account)
  const tokensMap = await ERC20ManagerDAO._getTokensByAddresses(Object.keys(assets), false, assets)
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
    const chronoBankAssetOwnershipManagerDAO = await contractManager.getChronoBankAssetOwnershipManagerDAO(token.platform())
    const result = await chronoBankAssetOwnershipManagerDAO.removeAssetPartOwner(token.symbol(), manager)
    if (result) {
      dispatch(getManagersForAssetSymbol(token.symbol()))
      dispatch(getAssetsManagerData())
    }
  }
  catch (e) {
    // eslint-disable-next-line
    console.error(e.message)
  }
}

export const addManager = (token: TokenModel, manager: String) => async dispatch => {
  try {
    const chronoBankAssetOwnershipManagerDAO = await contractManager.getChronoBankAssetOwnershipManagerDAO(token.platform())
    const result = await chronoBankAssetOwnershipManagerDAO.addAssetPartOwner(token.symbol(), manager)
    if (result) {
      dispatch(getManagersForAssetSymbol(token.symbol()))
      dispatch(getAssetsManagerData())
    }
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

export const setTotalSupply = (symbol, value) => (dispatch, getState) => {
  const totalSupply = getState().get('assetsManager').tokensMap.getIn([symbol, 'totalSupply']).plus(value)
  dispatch({type: SET_TOTAL_SUPPLY, payload: {symbol, totalSupply}})
}

const createTxModel = (tx, account, block, time): TxModel => {
  const gasPrice = new BigNumber(tx.gasPrice)

  return new TxModel({
    txHash: tx.transactionHash,
    type: tx.event,
    blockHash: tx.blockHash,
    blockNumber: block,
    transactionIndex: tx.transactionIndex,
    from: tx.args.by,
    to: tx.args.to,
    value: tx.args.value,
    gas: tx.gas,
    gasPrice,
    time,
    symbol: tx.args.symbol && Web3Converter.bytesToString(tx.args.symbol),
  })
}

const getTxModel = async (tx, account, block = null, time = null): Promise<?TxModel> => {
  const txDetails = await web3Provider.getTransaction(tx.transactionHash)
  tx.gasPrice = txDetails.gasPrice
  tx.gas = txDetails.gas

  if (block && time) {
    return createTxModel(tx, account, block, time)
  }
  block = await web3Provider.getBlock(tx.blockHash)
  return createTxModel(tx, account, tx.blockNumber, block.timestamp)
}

export const getTransactions = () => async (dispatch, getState) => {
  let platforms = getState().get('assetsManager')['platformsList']
  const account = getState().get('session').account
  const platformManagerDao = await contractManager.getPlatformManagerDAO()
  const transactionsPromises = []
  if (!platforms.length) {
    platforms = await platformManagerDao.getPlatformsMetadataForUser(account, dispatch, getState().get('assetsManager'))
  }

  transactionsPromises.push(platformManagerDao._get('PlatformRequested', 0, 'latest', {from: account}, 10))

  for (let platform of  platforms) {
    const chronoBankPlatformDAO = await contractManager.getChronoBankPlatformDAO(platform.address)
    const tokenManagementExtensionDAO = await contractManager.getTokenManagementExtensionDAO(platform.address)
    transactionsPromises.push(chronoBankPlatformDAO._get('Issue', 0, 'latest', {from: account}, 10))
    transactionsPromises.push(tokenManagementExtensionDAO._get('AssetCreated', 0, 'latest', {from: account}, 10))
  }

  const promises = []

  Promise.all(transactionsPromises)
    .then(transactionsLists => {
      let transactions = []
      for (let transactionsList of transactionsLists) {
        transactions = transactions.concat(transactionsList)
      }
      for (let tx of transactions) {
        promises.push(getTxModel(tx, account))
      }
      Promise.all(promises)
        .then(values => {
          dispatch({type: GET_TRANSACTIONS, payload: {transactionsList: values}})
        })
    })

}

