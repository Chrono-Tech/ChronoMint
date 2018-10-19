/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { LABOR_X_SIDECHAIN_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../web3'
import * as LXSidechainActions from './actions'
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
    const swapId = event.returnValues._swapID
    dispatch(notify(new SimpleNoticeModel({
      icon: 'lock',
      title: 'atomicSwapERC20.lock.title',
      message: 'atomicSwapERC20.lock.message',
      params: {
        id: swapId,
      },
    })))
    const swapDetail = await dao.check(swapId)
    const token = getLXTokenByAddress(swapDetail.erc20ContractAddress)(getState())
    const swap = new SwapModel({
      id: web3Converter.bytesToString(swapId),
      value: new Amount(swapDetail.erc20Value, token.symbol()),
      contractAddress: swapDetail.erc20ContractAddress,
      withdrawTrader: swapDetail.withdrawTrader,
      secretLock: swapDetail.secretLock,
    })
    dispatch(LXSidechainActions.swapUpdate(swap))
    // obtain swap
    dispatch(obtainSwapByMiddleware(swap.id))
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
    await SidechainMiddlewareService.obtainSwapInSidechain(swapId, signer.getPublicKey())
    return Promise.resolve({ e: null, res: true })
  } catch (e) {
    notify(new ErrorNoticeModel({ message: e.message }))
    return Promise.resolve({ e })
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
  await Promise.all(promises)
  // TODO @Abdulov do something
}
