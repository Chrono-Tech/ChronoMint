/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  bccProvider,
  btcProvider,
  btgProvider,
  ltcProvider,
} from '@chronobank/login/network/BitcoinProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import WavesDAO from '@chronobank/core/dao/WavesDAO'
import BigNumber from 'bignumber.js'
import { modalsOpenConfirmDialog } from '@chronobank/core-dependencies/redux/modals/actions'
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

//#region CONSTANTS

import {
  TRANSFER_CANCELLED,
} from '../../models/constants/TransferError'
import {
  WATCHER_TX_END,
  WATCHER_TX_SET,
} from '../watcher/constants'
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
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_LITECOIN,
  EVENT_UPDATE_LAST_BLOCK,
  BLOCKCHAIN_ETHEREUM,
  EVENT_NEW_BLOCK,
  EVENT_NEW_TOKEN,
  ETH,
} from  '../../dao/constants'
import {
  WAVES_DECIMALS,
  WAVES_WAVES_NAME,
  WAVES_WAVES_SYMBOL,
} from '../../dao/constants/WavesDAO'

//#endregion CONSTANTS

const submitTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  try {
    console.log('submitTxHandler: ', tx)
    if (tx.blockchain === BLOCKCHAIN_ETHEREUM) {
      console.log('submitTxHandler BLOCKCHAIN_ETHEREUM: ', tx)
      dispatch(modalsOpenConfirmDialog({
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
    // eslint-disable-next-line
    console.log('acceptTxHandler start: ', tx, dao)
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

const mainedTxHandler = (dao, dispatch) => async (tx: TransferExecModel | TxExecModel) => {
  if (tx.blockchain === BLOCKCHAIN_ETHEREUM) {
    dispatch({ type: WATCHER_TX_END, tx })
  }
}

export const alternateTxHandlingFlow = (dao) => (dispatch) => {
  dao
    .on('submit', submitTxHandler(dao, dispatch))
    .on('accept', acceptTxHandler(dao, dispatch))
    .on('reject', rejectTxHandler(dao, dispatch))
}

export const initTokens = () => async (dispatch, getState) => {
  if (getState().get(DUCK_TOKENS).isInited()) {
    return
  }
  const web3 = getState().get('web3')
  ethereumDAO.connect(web3)
  dispatch(alternateTxHandlingFlow(ethereumDAO))
  dispatch({ type: TOKENS_INIT, isInited: true })

  dispatch({ type: TOKENS_FETCHING, count: 0 })

  const erc20: ERC20ManagerDAO = daoByType('ERC20Manager')(getState())

  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, async (count) => {
      const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
      dispatch({ type: TOKENS_FETCHING, count: currentCount + count + 1 /*eth*/ })

      // eth
      const eth: TokenModel = await ethereumDAO.getToken()
      if (eth) {
        dispatch({ type: TOKENS_FETCHED, token: eth })
        tokenService.registerDAO(eth, ethereumDAO)
      }
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch({ type: TOKENS_FETCHED, token })
      const dao = tokenService.createDAO(token, web3)
      dispatch(alternateTxHandlingFlow(dao))
    })
    .fetchTokens()

  dispatch(initBtcLikeTokens())
  dispatch(initNemTokens())
  dispatch(initWavesTokens())
  dispatch(watchLatestBlock())
}

export const initBtcLikeTokens = () => async (dispatch, getState) => {
  const btcLikeTokens = [btcDAO, bccDAO, btgDAO, ltcDAO]
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch({ type: TOKENS_FETCHING, count: currentCount + btcLikeTokens.length })

  return Promise.all(
    btcLikeTokens
      .map(async (dao) => {
        try {
          dao.on(EVENT_UPDATE_LAST_BLOCK, (newBlock) => {
            const blocks = getState().get(DUCK_TOKENS).latestBlocks()
            const currentBlock = blocks[dao.getBlockchain()]
            if (currentBlock && newBlock.block.blockNumber > currentBlock.blockNumber) {
              dispatch({ type: TOKENS_UPDATE_LATEST_BLOCK, ...newBlock })
            }
          })
          await dao.watchLastBlock()
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch({ type: TOKENS_FETCHED, token })
          dispatch(alternateTxHandlingFlow(dao))
          const currentBlock = await dao.getCurrentBlockHeight()
          dispatch({ type: TOKENS_UPDATE_LATEST_BLOCK, block: { blockNumber: currentBlock.currentBlock }, blockchain: token.blockchain() })
        } catch (e) {
          dispatch({ type: TOKENS_FAILED })
        }
      }),
  )
}

export const initNemTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch({ type: TOKENS_FETCHING, count: currentCount + 1 })
    const dao = new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS)
    const nem = await dao.fetchToken()
    tokenService.registerDAO(nem, dao)
    dispatch({ type: TOKENS_FETCHED, token: nem })
    dispatch(alternateTxHandlingFlow(dao))
    dispatch(initNemMosaicTokens(nem))
  } catch (e) {
    dispatch({ type: TOKENS_FAILED })
  }
}

export const initNemMosaicTokens = (nem: TokenModel) => async (dispatch, getState) => {

  const mosaics = nemProvider.getMosaics()
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch({ type: TOKENS_FETCHING, count: currentCount + mosaics.length })
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    mosaics
      .map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.decimals, m.definition, nem))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch({ type: TOKENS_FETCHED, token })
          dispatch(alternateTxHandlingFlow(dao))
        } catch (e) {
          dispatch({ type: TOKENS_FAILED })
        }
      }),
  )
}

export const initWavesTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch({ type: TOKENS_FETCHING, count: currentCount + 1 })
    const dao = new WavesDAO(WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL, wavesProvider, WAVES_DECIMALS, 'WAVES')
    const waves = await dao.fetchToken()
    tokenService.registerDAO(waves, dao)
    dispatch({ type: TOKENS_FETCHED, token: waves })
    dispatch(alternateTxHandlingFlow(dao))
    dispatch(initWavesAssetTokens(waves))
  } catch (e) {
    dispatch({ type: TOKENS_FAILED })
  }
}

export const initWavesAssetTokens = (waves: TokenModel) => async (dispatch, getState) => {
  const assets = await wavesProvider.getAssets()
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch({ type: TOKENS_FETCHING, count: currentCount + assets.length })
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    Object.keys(assets)
      .map((m) => new WavesDAO(m, m, wavesProvider, assets[m]['decimals'], assets[m]['id'], waves))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch({ type: TOKENS_FETCHED, token })
          dispatch(alternateTxHandlingFlow(dao))
        } catch (e) {
          dispatch({ type: TOKENS_FAILED })
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
    dispatch({
      type: TOKENS_UPDATE_LATEST_BLOCK,
      blockchain: BLOCKCHAIN_ETHEREUM,
      block,
    })
  })
  const block = await ethereumDAO.getBlockNumber()
  dispatch({
    type: TOKENS_UPDATE_LATEST_BLOCK,
    blockchain: BLOCKCHAIN_ETHEREUM,
    block: {
      blockNumber: block,
    },
  })

}

export const estimateGas = (tokenId, params, callback, gasPriceMultiplier = 1, address) => async () => {
  const tokenDao = tokenService.getDAO(tokenId)
  const [to, amount, func] = params
  try {
    const { gasLimit, gasFee, gasPrice } = await tokenDao.estimateGas(func, [to, new BigNumber(amount)], new BigNumber(0), address)
    callback(null, {
      gasLimit,
      gasFee: new Amount(gasFee.mul(gasPriceMultiplier), ETH),
      gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier), ETH),
    })
  } catch (e) {
    callback(e)
  }
}

export const estimateBtcFee = (params, callback) => async () => {
  try {
    const { address, recipient, amount, formFee, blockchain } = params
    let fee
    switch (blockchain) {
      case BLOCKCHAIN_BITCOIN:
        fee = await btcProvider.estimateFee(address, recipient, amount, formFee)
        break
      case BLOCKCHAIN_BITCOIN_CASH:
        fee = await bccProvider.estimateFee(address, recipient, amount, formFee)
        break
      case BLOCKCHAIN_BITCOIN_GOLD:
        fee = await btgProvider.estimateFee(address, recipient, amount, formFee)
        break
      case BLOCKCHAIN_LITECOIN:
        fee = await ltcProvider.estimateFee(address, recipient, amount, formFee)
        break
    }
    callback(null, { fee: fee })
  } catch (e) {
    callback(e)
  }
}

