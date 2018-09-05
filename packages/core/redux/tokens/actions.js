/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import WavesDAO from '@chronobank/core/dao/WavesDAO'
import { modalsOpen } from '@chronobank/core-dependencies/redux/modals/actions'
import { showConfirmTransferModal } from '@chronobank/core-dependencies/redux/ui/actions'
import { bccDAO, btcDAO, btgDAO, ltcDAO } from '../../dao/BitcoinDAO'
import ERC20ManagerDAO from '../../dao/ERC20ManagerDAO'
import ethereumDAO from '../../dao/EthereumDAO'
import NemDAO from '../../dao/NemDAO'
import TokenModel from '../../models/tokens/TokenModel'
import type TransferExecModel from '../../models/TransferExecModel'
import TransferError from '../../models/TransferError'
import tokenService from '../../services/TokenService'
import { notifyError } from '../notifier/actions'
import Amount from '../../models/Amount'
import { daoByType } from '../daos/selectors'
import TxExecModel from '../../models/TxExecModel'
import { web3Selector } from '../ethereum/selectors'
import { estimateGas } from '../ethereum/thunks'

import { TRANSFER_CANCELLED } from '../../models/constants/TransferError'
import { WATCHER_TX_SET } from '../watcher/constants'
import {
  DUCK_TOKENS,
  TOKENS_FAILED,
  TOKENS_FETCHED,
  TOKENS_FETCHING,
  TOKENS_INIT,
  TOKENS_UPDATE_LATEST_BLOCK,
} from './constants'
import {
  EVENT_ERC20_TOKENS_COUNT,
  EVENT_NEW_ERC20_TOKEN,
} from '../../dao/constants/ERC20ManagerDAO'
import {
  NEM_DECIMALS,
  NEM_XEM_NAME,
  NEM_XEM_SYMBOL,
} from '../../dao/constants/NemDAO'
import {
  BLOCKCHAIN_ETHEREUM,
  ETH,
  EVENT_NEW_BLOCK,
  EVENT_NEW_TOKEN,
  EVENT_UPDATE_LAST_BLOCK,
} from '../../dao/constants'
import {
  WAVES_DECIMALS,
  WAVES_WAVES_NAME,
  WAVES_WAVES_SYMBOL,
} from '../../dao/constants/WavesDAO'
import { DAOS_REGISTER } from '../daos/constants'
import { ContractDAOModel, ContractModel } from '../../models'

const tokensInit = () => ({ type: TOKENS_INIT })

const setTokensFetchingCount = (count) => ({ type: TOKENS_FETCHING, count })

const tokenFetched = (token) => ({ type: TOKENS_FETCHED, token })

const tokensLoadingFailed = () => ({ type: TOKENS_FAILED })

export const setLatestBlock = (blockchain, block) => ({ type: TOKENS_UPDATE_LATEST_BLOCK, blockchain, block })

const submitTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  try {
    if (tx.blockchain === BLOCKCHAIN_ETHEREUM) {
      dispatch(modalsOpen({
        comnponentName: 'ConfirmTxDialog',
        props: {
          tx,
          dao,
          confirm: (tx) => dao.accept(tx),
          reject: (tx) => dao.reject(tx),
        },
      }))
    } else {
      await dispatch(showConfirmTransferModal(dao, tx))
    }
  } catch (e) {
    dispatch(notifyError(e, tx.funcTitle()))
  }
}

const acceptTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  try {
    if (tx.blockchain === BLOCKCHAIN_ETHEREUM) {
      dispatch({ type: WATCHER_TX_SET, tx })
      await dao.immediateTransfer(tx)
    } else {
      const txOptions = tx.options()
      await dao.immediateTransfer(tx.from(), tx.to(), tx.amount(), tx.amountToken(), tx.feeMultiplier(), txOptions.advancedParams)
    }
  } catch (e) {
    dispatch(notifyError(e, tx.funcTitle()))
  }
}

const rejectTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  const e = new TransferError('Rejected', TRANSFER_CANCELLED)
  dispatch(notifyError(e, tx.funcTitle()))
}

export const alternateTxHandlingFlow = (dao) => (dispatch) => {
  dao
    .on('submit', submitTxHandler(dao, dispatch))
    .on('accept', acceptTxHandler(dao, dispatch))
    .on('reject', rejectTxHandler(dao, dispatch))
}

export const initTokens = () => async (dispatch, getState) => {
  let state = getState()
  if (state.get(DUCK_TOKENS).isInited()) {
    return
  }
  const web3 = web3Selector()(state)
  ethereumDAO.connect(web3)

  dispatch(tokensInit())
  dispatch(setTokensFetchingCount(0))
  const erc20: ERC20ManagerDAO = daoByType('ERC20Manager')(state)

  state = getState()
  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, async (count) => {
      const currentCount = state.get(DUCK_TOKENS).leftToFetch()
      dispatch(setTokensFetchingCount(currentCount + count + 1 /*eth*/))

      // eth
      const eth: TokenModel = await ethereumDAO.getToken()
      if (eth) {
        dispatch(tokenFetched(eth))
        tokenService.registerDAO(eth, ethereumDAO)
      }
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch(tokenFetched(token))
      const dao = tokenService.createDAO(token, web3)

      dispatch({
        type: DAOS_REGISTER,
        model: new ContractDAOModel({
          contract: new ContractModel({
            abi: dao.abi,
            type: token.symbol(),
          }),
          address: token.address(),
          dao,
        }),
      })

    })
    .fetchTokens()

  dispatch(initBtcLikeTokens())
  dispatch(initNemTokens())
  dispatch(initWavesTokens())
  dispatch(watchLatestBlock())
}

export const initBtcLikeTokens = () => async (dispatch, getState) => {
  const state = getState()
  const btcLikeTokens = [btcDAO, bccDAO, btgDAO, ltcDAO]
  const currentCount = state.get(DUCK_TOKENS).leftToFetch()
  dispatch(setTokensFetchingCount(currentCount + btcLikeTokens.length))

  return Promise.all(
    btcLikeTokens
      .map(async (dao) => {
        try {
          dao.on(EVENT_UPDATE_LAST_BLOCK, (newBlock) => {
            const blocks = state.get(DUCK_TOKENS).latestBlocks()
            const currentBlock = blocks[dao.getBlockchain()]
            if (currentBlock && newBlock.block.blockNumber > currentBlock.blockNumber) {
              dispatch(setLatestBlock(newBlock.blockchain, newBlock.block))
            }
          })
          await dao.watchLastBlock()
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(tokenFetched(token))
          const currentBlock = await dao.getCurrentBlockHeight()
          dispatch(setLatestBlock(token.blockchain(), { blockNumber: currentBlock.currentBlock }))
        } catch (e) {
          dispatch(tokensLoadingFailed())
        }
      }),
  )
}

export const initNemTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch(setTokensFetchingCount(currentCount + 1))

    const dao = new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS)
    const nem = await dao.fetchToken()
    tokenService.registerDAO(nem, dao)
    dispatch(tokenFetched(nem))
    dispatch(initNemMosaicTokens(nem))
  } catch (e) {
    dispatch(tokensLoadingFailed())
  }
}

export const initNemMosaicTokens = (nem: TokenModel) => async (dispatch, getState) => {
  const mosaics = nemProvider.getMosaics()
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch(setTokensFetchingCount(currentCount + mosaics.length))
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    mosaics
      .map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.decimals, m.definition, nem))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(tokenFetched(token))
        } catch (e) {
          dispatch(tokensLoadingFailed())
        }
      }),
  )
}

export const initWavesTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch(setTokensFetchingCount(currentCount + 1))
    const dao = new WavesDAO(WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL, wavesProvider, WAVES_DECIMALS, 'WAVES')
    const waves = await dao.fetchToken()
    tokenService.registerDAO(waves, dao)
    dispatch(tokenFetched(waves))
    dispatch(alternateTxHandlingFlow(dao))
    dispatch(initWavesAssetTokens(waves))
  } catch (e) {
    dispatch(tokensLoadingFailed())
  }
}

export const initWavesAssetTokens = (waves: TokenModel) => async (dispatch, getState) => {
  const assets = await wavesProvider.getAssets()
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch(setTokensFetchingCount(currentCount + Object.keys(assets).length))
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    Object.keys(assets)
      .map((m) => new WavesDAO(m, m, wavesProvider, assets[m]['decimals'], assets[m]['id'], waves))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(tokenFetched(token))
          dispatch(alternateTxHandlingFlow(dao))
        } catch (e) {
          dispatch(tokensLoadingFailed())
        }
      }),
  )
}

export const subscribeOnTokens = (callback) => (dispatch, getState) => {
  const handleToken = (token) => dispatch(callback(token))
  tokenService.on(EVENT_NEW_TOKEN, handleToken)
  // fetch for existing tokens
  const tokens = getState().get(DUCK_TOKENS)
  tokens.list().forEach(handleToken)
}

export const watchLatestBlock = () => async (dispatch) => {
  ethereumDAO.on(EVENT_NEW_BLOCK, (block) => {
    dispatch(setLatestBlock(BLOCKCHAIN_ETHEREUM, block))
  })
  const block = await ethereumDAO.getBlockNumber()
  dispatch(setLatestBlock(BLOCKCHAIN_ETHEREUM, { blockNumber: block }))
}

export const estimateGasTransfer = (tokenId, params, callback, gasPriceMultiplier = 1, address) => async (dispatch) => {
  const tokenDao = tokenService.getDAO(tokenId)
  const [to, amount] = params
  const tx = tokenDao.transfer(address, to, amount)
  try {
    const { gasLimit, gasFee, gasPrice } = await dispatch(estimateGas(tx))
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier).toString(), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier).toString(), ETH),
    })
  } catch (e) {
    callback(e)
  }
}
