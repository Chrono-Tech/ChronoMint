/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { LABOR_X_SIDECHAIN_NETWORK_CONFIG } from '@chronobank/login/network/settings'
import web3Factory from '../../web3'
import { daoByType, getLXToken, getLXTokenByAddress, getLXWeb3 } from './selectors/mainSelectors'
import { daoByType as daoByTypeMainnet } from '../daos/selectors'
import { ATOMIC_SWAP_ERC20, CHRONOBANK_PLATFORM_SIDECHAIN, MULTI_EVENTS_HISTORY } from './dao/ContractList'
import ContractDAOModel from '../../models/contracts/ContractDAOModel'
import { EVENT_CLOSE, EVENT_EXPIRE, EVENT_OPEN, EVENT_REVOKE } from './constants'
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
import { executeTransaction } from '../ethereum/thunks'

export const initLXSidechain = () => async (dispatch) => {
  await dispatch(initWeb3())
  await dispatch(initContracts())
  await dispatch(initTokens())
  await dispatch(watch())
  // await dispatch(obtainAllOpenSwaps())
}

const initWeb3 = () => async (dispatch) => {
  const web3 = web3Factory(LABOR_X_SIDECHAIN_NETWORK_CONFIG)
  await dispatch(LXSidechainActions.updateWeb3(web3))
}

const initContracts = () => async (dispatch, getState) => {
  const web3 = getLXWeb3(getState())
  const networkId = await web3.eth.net.getId()
  const contracts = [
    CHRONOBANK_PLATFORM_SIDECHAIN,
    ATOMIC_SWAP_ERC20,
  ]
  const historyAddress = MULTI_EVENTS_HISTORY.abi.networks[networkId].address

  const getDaoModel = async (contract) => {
    const contractAddress = contract.abi.networks[networkId].address
    const contractDAO = contract.create(contractAddress, historyAddress)
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
  const ChronoBankPlatformSidechainDAO = daoByType('ChronoBankPlatformSidechain')(getState())

  ChronoBankPlatformSidechainDAO.watchEvent(EVENT_REVOKE, async (event) => {
    const { symbol, value } = event.returnValues
    const token = getLXToken(web3Converter.bytesToString(symbol))(getState())

    dispatch(notify(new SimpleNoticeModel({
      title: 'chronoBankPlatformSidechain.revoke.title',
      message: 'chronoBankPlatformSidechain.revoke.message',
      params: {
        amount: token.removeDecimals(new BigNumber(value)),
        symbol: token.symbol(),
      },
    })))

    const mainEthWallet = getMainEthWallet(getState())
    const { data } = await SidechainMiddlewareService.getSwapListFromSidechainToMainnetByAddress(mainEthWallet.address)
    const swap = data[data.length - 1] // last swap.
    if (swap) {
      const { data } = await dispatch(obtainSwapByMiddlewareFromSidechainToMainnet(swap.swap_id))
      if (data) {
        dispatch(unlockShares(swap.swap_id, data))
      }
    }
  })

  const atomicSwapERC20DAO = daoByType('AtomicSwapERC20')(getState())
  atomicSwapERC20DAO.watchEvent(EVENT_OPEN, async (event) => {
    const swapId = web3Converter.bytesToString(event.returnValues._swapID)
    dispatch(notify(new SimpleNoticeModel({
      icon: 'lock',
      title: 'atomicSwapERC20.lock.title',
      message: 'atomicSwapERC20.lock.message',
      params: {
        id: swapId,
      },
    })))
    const swapDetail = await atomicSwapERC20DAO.check(event.returnValues._swapID) // in bytes
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
    const { data } = await dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(swapId))
    if (data) {
      dispatch(closeSwap(data, swapId))
    }
  })

  atomicSwapERC20DAO.watchEvent(EVENT_CLOSE, (event) => {
    const { _swapID: swapId } = event.returnValues
    dispatch(notify(new SimpleNoticeModel({
      title: 'atomicSwapERC20.close.title',
      message: 'atomicSwapERC20.close.message',
      params: {
        id: web3Converter.bytesToString(swapId),
      },
    })))
    // TODO @Abdulov update balance
  })

  atomicSwapERC20DAO.watchEvent(EVENT_EXPIRE, (event) => {
    const { _swapID: swapId } = event.returnValues
    dispatch(notify(new SimpleNoticeModel({
      title: 'atomicSwapERC20.expire.title',
      message: 'atomicSwapERC20.expire.message',
      params: {
        id: web3Converter.bytesToString(swapId),
      },
    })))
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
    const mainEthWallet = getMainEthWallet(getState())
    const balance = await tokenDao.getAccountBalance(mainEthWallet.address)
    // TODO @abdulov remove console.log
    console.log('%c balance', 'background: #222; color: #fff', mainEthWallet.address, token.set('decimals', decimals).removeDecimals(balance).toString(), token.symbol())
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

const obtainSwapByMiddlewareFromMainnetToSidechain = (swapId) => async (dispatch, getState) => {
  try {
    const signer = getEthereumSigner(getState())
    const { data } = await SidechainMiddlewareService.obtainSwapFromMainnetToSidechain(swapId, signer.getPublicKey())
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
    return Promise.resolve({ e, swapId })
  }
}

const obtainSwapByMiddlewareFromSidechainToMainnet = (swapId) => async (dispatch, getState) => {
  try {
    const signer = getEthereumSigner(getState())
    const { data } = await SidechainMiddlewareService.obtainSwapFromSidechainToMainnet(swapId, signer.getPublicKey())
    return Promise.resolve({ e: null, data, swapId })
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
    return Promise.resolve({ e, swapId })
  }
}

const closeSwap = (encodedKey, swapId, index) => async (dispatch, getState) => {
  const dao = daoByType('AtomicSwapERC20')(getState())
  const web3 = web3Factory(LABOR_X_SIDECHAIN_NETWORK_CONFIG)
  const mainEthWallet = getMainEthWallet(getState())
  const signer = getEthereumSigner(getState())
  const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

  const promises = [
    web3.eth.net.getId(),
    web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    signer.decryptWithPrivateKey(encodedKey),
  ]
  const [chainId, nonce, key] = await Promise.all(promises)

  const tx = {
    ... dao.close(web3Converter.stringToBytes(swapId), web3Converter.stringToBytes(key)),
    gas: 5700000, // TODO @Abdulov remove hard code and do something
    gasPrice: 80000000000,
    nonce: nonce + (index || 0), // increase nonce because transactions send at the same time
    chainId: chainId,
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
  const { data } = await SidechainMiddlewareService.getSwapListFromMainnetToSidechainByAddress(mainEthWallet.address)
  const promises = []
  // promises.push(dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(data[0].swap_id)))
  data.forEach((swap) => {
    if (swap.isActive) {
      promises.push(dispatch(obtainSwapByMiddlewareFromMainnetToSidechain(swap.swap_id)))
    }
  })
  const results = await Promise.all(promises)

  results.forEach(async ({ data, swapId }, i) => {
    if (data) {
      dispatch(closeSwap(data, swapId, i))
    }
  })
}

export const sidechainWithdraw = (amount: Amount, token: TokenModel) => async (dispatch, getState) => {
  try {
    const platformDao = daoByType('ChronoBankPlatformSidechain')(getState())
    const web3 = web3Factory(LABOR_X_SIDECHAIN_NETWORK_CONFIG)
    const mainEthWallet = getMainEthWallet(getState())
    const signer = getEthereumSigner(getState())
    const { selectedWallet } = getState().get(DUCK_PERSIST_ACCOUNT)

    const promises = [
      web3.eth.net.getId(),
      web3.eth.getTransactionCount(mainEthWallet.address, 'pending'),
    ]
    const [chainId, nonce] = await Promise.all(promises)

    const tx = {
      ...platformDao.revokeAsset(web3Converter.stringToBytes(token.symbol()), amount),
      gas: 5700000, // TODO @Abdulov remove hard code and do something
      gasPrice: 80000000000,
      nonce: nonce,
      chainId: chainId,
    }

    const signedTx = await signer.signTransaction({ ...tx }, selectedWallet.encrypted[0].path)
    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
      .on('transactionHash', (hash) => {
        // TODO @abdulov remove console.log
        console.log('%c hash', 'background: #222; color: #fff', hash)
      })
      .on('receipt', (receipt) => {
        // TODO @abdulov remove console.log
        console.log('%c receipt', 'background: #222; color: #fff', receipt)
      })
      .on('error', (error) => {
        // TODO @abdulov remove console.log
        console.log('%c error', 'background: #222; color: #fff', error)
      })
  } catch (e) {
    // eslint-disable-next-line
    console.error('deposit error', e)
  }
}

const unlockShares = (swapId, encodedKey) => async (dispatch, getState) => {
  try {
    const timeHolderDAO = daoByTypeMainnet('TimeHolder')(getState())
    const signer = getEthereumSigner(getState())
    const key = await signer.decryptWithPrivateKey(encodedKey)
    const tx = timeHolderDAO.unlockShares(web3Converter.stringToBytes(swapId), web3Converter.stringToBytes(key))
    dispatch(executeTransaction({ tx }))
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e)
    dispatch(notifyUnknownError())
  }
}

export const notifyUnknownError = () => {
  notify(new ErrorNoticeModel({
    title: 'errors.labotHour.unknown.title',
    message: 'errors.labotHour.unknown.message',
  }))
}
