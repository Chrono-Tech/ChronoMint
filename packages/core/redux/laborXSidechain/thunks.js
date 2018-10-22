/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import utils from 'ethereumjs-util'
import { LABOR_X_SIDECHAIN_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../web3'
import { daoByType, getLXTokenByAddress, getLXWeb3 } from './selectors/mainSelectors'
import { ATOMIC_SWAP_ERC20, CHRONOBANK_PLATFORM_SIDECHAIN } from './dao/ContractList'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { EVENT_CLOSE, EVENT_EXPIRE, EVENT_OPEN } from './constants'
import { notify } from '../notifier/actions'
import SimpleNoticeModel from '../../models/notices/SimpleNoticeModel'
import SwapModel from '../../models/SwapModel'
import Amount from '../../models/Amount'
import ERC20TokenDAO from '../../dao/ERC20TokenDAO'
import web3Converter from '../../utils/Web3Converter'
import TokenModel from '../../models/tokens/TokenModel'
import ContractModel from '../../models/contracts/ContractModel'
import SidechainMiddlewareService from './SidechainMiddlewareService'
import { getEthereumSigner } from '../persistAccount/selectors'
import ErrorNoticeModel from '../../models/notices/ErrorNoticeModel'
import { getMainEthWallet } from '../wallets/selectors/models'
import * as LXSidechainActions from './actions'
import { DUCK_PERSIST_ACCOUNT } from '../persistAccount/constants'

export const initLXSidechain = () => async (dispatch) => {
  await dispatch(initWeb3())
  await dispatch(initContracts())
  await dispatch(initTokens())
  await dispatch(watch())
  await dispatch(obtainAllOpenSwaps())
}

const initWeb3 = () => async (dispatch) => {
  const web3 = web3Factory(LABOR_X_SIDECHAIN_NETWORK_CONFIG)
  await dispatch(LXSidechainActions.updateWeb3(web3))
}

const initContracts = () => async (dispatch, getState) => {
  const web3 = getLXWeb3(getState())
  const networkId = await web3.eth.net.getId()
  const contracts = [
    ATOMIC_SWAP_ERC20,
    CHRONOBANK_PLATFORM_SIDECHAIN,
  ]

  const getDaoModel = async (contract) => {
    const contractAddress = contract.abi.networks[networkId].address
    const contractDAO = contract.create(contractAddress)
    await contractDAO.connect(web3)

    dispatch(LXSidechainActions.daosRegister(
      new ContractDAOModel({
        contract,
        address: contractDAO.address,
        dao: contractDAO,
      }),
    ))
  }

  await Promise.all(
    contracts.map((contract) => {
      return getDaoModel(contract)
    }),
  )
}

const watch = () => (dispatch, getState) => {
  const dao = daoByType('AtomicSwapERC20')(getState())
  dao.watchEvent(EVENT_OPEN, async (event) => {
    const swapId = web3Converter.bytesToString(event.returnValues._swapID)
    dispatch(notify(new SimpleNoticeModel({
      icon: 'lock',
      title: 'atomicSwapERC20.lock.title',
      message: 'atomicSwapERC20.lock.message',
      params: {
        id: swapId,
      },
    })))
    const swapDetail = await dao.check(event.returnValues._swapID) // in bytes
    const token = getLXTokenByAddress(swapDetail.erc20ContractAddress)(getState())
    const swap = new SwapModel({
      id: swapId,
      value: new Amount(swapDetail.erc20Value, token.symbol()),
      contractAddress: swapDetail.erc20ContractAddress,
      withdrawTrader: swapDetail.withdrawTrader,
      secretLock: swapDetail.secretLock,
    })
    dispatch(LXSidechainActions.swapUpdate(swap))
    // obtain swap
    const { data } = await dispatch(obtainSwapByMiddleware(swapId))
    if (data) {
      dispatch(closeSwap(data, swapId))
    }
  })
  dao.watchEvent(EVENT_CLOSE, (/*event*/) => {
    // TODO @Abdulov do something
  })
  dao.watchEvent(EVENT_EXPIRE, (/*event*/) => {
    // TODO @Abdulov do something
  })
}

const initTokens = () => async (dispatch, getState) => {
  const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
  const symbolsCount = await platformDao.symbolsCount()
  dispatch(LXSidechainActions.setTokensFetchingCount(symbolsCount))
  const promises = []
  for (let i = 0; i < symbolsCount; i++) {
    promises.push(dispatch(loadTokenByIndex(i)))
  }
  await Promise.all(promises)
}

const loadTokenByIndex = (symbolIndex) => async (dispatch, getState) => {
  try {
    const state = getState()
    const web3 = getLXWeb3(state)
    const platformDao = daoByType('ChronoBankPlatformSidechain')(state)
    const symbol = await platformDao.symbols(symbolIndex) // bytes32
    const address = await platformDao.proxies(symbol)
    const token = new TokenModel({
      address: address.toLowerCase(),
      symbol: web3Converter.bytesToString(symbol),
      isFetched: true,
      isERC20: true,
    })
    const tokenDao = new ERC20TokenDAO(token)
    tokenDao.connect(web3)
    const decimals = await tokenDao.getDecimals()

    const mainEthWallet = getMainEthWallet(getState())
    const balance = await tokenDao.getAccountBalance(mainEthWallet.address)
    const dao = daoByType('AtomicSwapERC20')(getState())
    // TODO @abdulov remove console.log
    console.log('%c dao', 'background: #222; color: #fff', dao.address)
    const balanceSwap = await tokenDao.getAccountBalance(mainEthWallet.address)
    // TODO @abdulov remove console.log
    console.log('%c balanceSwap', 'background: #222; color: #fff', balanceSwap.toString())
    // TODO @abdulov remove console.log
    console.log('%c balance', 'background: #222; color: #fff', balance.toString(), token.symbol())
    dispatch(LXSidechainActions.tokenFetched(token.set('decimals', decimals)))
    dispatch(LXSidechainActions.daosRegister(
      new ContractDAOModel({
        contract: new ContractModel({
          abi: tokenDao.abi,
          type: token.symbol(),
        }),
        address: token.address(),
        dao: tokenDao,
      }),
    ))
    return Promise.resolve({ e: null, res: true })
  } catch (e) {
    return Promise.resolve({ e })
  }
}

const obtainSwapByMiddleware = (swapId) => async (dispatch, getState) => {
  try {
    const signer = getEthereumSigner(getState())
    const { data } = await SidechainMiddlewareService.obtainSwapInSidechain(swapId, signer.getPublicKey())
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    notify(new ErrorNoticeModel({ message: e.message }))
    return Promise.resolve({ e, swapId })
  }
}

const closeSwap = (encodedKey, swapId) => async (dispatch, getState) => {
  // TODO @abdulov remove console.log
  console.log('%c encodedKey, swapId', 'background: #222; color: #fff', encodedKey, swapId)

  const dao = daoByType('AtomicSwapERC20')(getState())

  const swapDetail = await dao.check(web3Converter.stringToBytes(swapId))
  // TODO @abdulov remove console.log
  console.log('%c swapDetail', 'background: #222; color: #fff', swapDetail)
  // TODO @abdulov remove console.log
  console.log('%c swapDetail.secretLock', 'background: #222; color: #fff', swapDetail.secretLock)

  const web3 = web3Factory(LABOR_X_SIDECHAIN_NETWORK_CONFIG)
  const mainEthWallet = getMainEthWallet(getState())
  const chainId = await web3.eth.net.getId()
  const nonce = await web3.eth.getTransactionCount(mainEthWallet.address, 'pending')
  const signer = getEthereumSigner(getState())
  const key = await signer.decryptWithPrivateKey(encodedKey)
  // TODO @abdulov remove console.log
  console.log('%c decoded key', 'background: #222; color: #fff', key)
  console.log('%c decoded key sha256', 'background: #222; color: #fff', utils.sha256(key).toString('hex'))
  const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)
  const tx = {
    ... dao.close(web3Converter.stringToBytes(swapId), web3Converter.stringToBytes(key)),
    gasLimit: "80000",
    gasPrice: await web3.eth.getGasPrice(),
    nonce: nonce,
    chainId,
    value: 0,
  }
  const signedTx = await signer.signTransaction({ ...tx }, selectedWallet.encrypted[0].path)
  try {
    await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  } catch (e) {
    // TODO @abdulov remove console.log
    console.log('%c e', 'background: #222; color: #fff', e)
  }
}

const obtainAllOpenSwaps = () => async (dispatch, getState) => {
  const mainEthWallet = getMainEthWallet(getState())
  const { data } = await SidechainMiddlewareService.getSwapListByAddress(mainEthWallet.address)
  const promises = []
  data.forEach((swap) => {
    if (swap.isActive) {
      promises.push(dispatch(obtainSwapByMiddleware(swap.swap_id)))
    }
  })
  const results = await Promise.all(promises)

  results.forEach(async ({ data, swapId }) => {
    if (data) {
      dispatch(closeSwap(data, swapId))
    }
  })
}
