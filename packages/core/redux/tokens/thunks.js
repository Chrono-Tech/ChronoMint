/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import * as BitcoinMiddlewaresAPI from '@chronobank/nodes/httpNodes/api/chronobankNodes/bitcoins'
import * as NemMiddlewareApi from '@chronobank/nodes/httpNodes/api/chronobankNodes/nem'
import WavesDAO from '@chronobank/core/dao/WavesDAO'
import { bccDAO, btcDAO, btgDAO, ltcDAO } from '../../dao/BitcoinDAO'
import { daoByType } from '../daos/selectors'
import { estimateGas } from '../ethereum/thunks'
import { selectWalletAddressByBlockchain } from '../wallets/selectors/wallets'
import { web3Selector } from '../ethereum/selectors'
import Amount from '../../models/Amount'
import ERC20ManagerDAO from '../../dao/ERC20ManagerDAO'
import ethereumDAO from '../../dao/EthereumDAO'
import NemDAO from '../../dao/NemDAO'
import TokenModel from '../../models/tokens/TokenModel'
import tokenService from '../../services/TokenService'
import {
  DUCK_TOKENS,
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
  BLOCKCHAIN_NEM,
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
import * as TokensActions from './actions'

export const initTokens = () => async (dispatch, getState) => {
  let state = getState()
  if (state.get(DUCK_TOKENS).isInited()) {
    return
  }
  const web3 = web3Selector()(state)
  ethereumDAO.connect(web3)

  dispatch(TokensActions.tokensInit())
  dispatch(TokensActions.setTokensFetchingCount(0))
  const erc20: ERC20ManagerDAO = daoByType('ERC20Manager')(state)

  state = getState()
  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, async (count) => {
      const currentCount = state.get(DUCK_TOKENS).leftToFetch()
      dispatch(TokensActions.setTokensFetchingCount(currentCount + count + 1 /*eth*/))

      // eth
      const eth: TokenModel = await ethereumDAO.getToken()
      if (eth) {
        dispatch(TokensActions.tokenFetched(eth))
        tokenService.registerDAO(eth, ethereumDAO)
      }
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      dispatch(TokensActions.tokenFetched(token))
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
  dispatch(TokensActions.setTokensFetchingCount(currentCount + btcLikeTokens.length))

  return Promise.all(
    btcLikeTokens
      .map(async (dao) => {
        try {
          const blockchain = dao.getBlockchain()
          dao.on(EVENT_UPDATE_LAST_BLOCK, (newBlock) => {
            const blocks = state.get(DUCK_TOKENS).latestBlocks()
            const currentBlock = blocks[blockchain]
            if (currentBlock && newBlock.block.blockNumber > currentBlock.blockNumber) {
              dispatch(TokensActions.setLatestBlock(newBlock.blockchain, newBlock.block))
            }
          })
          await dao.watchLastBlock()
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(TokensActions.tokenFetched(token))
          const currentBlock = await dispatch(BitcoinMiddlewaresAPI.requestBlocksHeight(blockchain))
          dispatch(TokensActions.setLatestBlock(blockchain, { blockNumber: currentBlock.currentBlock }))
        } catch (error) {
          dispatch(TokensActions.tokensLoadingFailed())
        }
      }),
  )
}

export const initNemTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch(TokensActions.setTokensFetchingCount(currentCount + 1))

    const dao = new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS)
    const nem = await dao.fetchToken()
    tokenService.registerDAO(nem, dao)
    dispatch(TokensActions.tokenFetched(nem))
    dispatch(initNemMosaicTokens(nem))
  } catch (e) {
    dispatch(TokensActions.tokensLoadingFailed())
  }
}

export const initNemMosaicTokens = (nem: TokenModel) => async (dispatch, getState) => {
  // const mosaics = nemProvider.getMosaics()
  const mosaics = [{
    definition: {
      creator: 'cb60520c740f867ea01a60e662e833a5f7f9d3070fdf23cdcf903d6abc1cdd52',
      description: 'chronobank bonus minutes',
      id: {
        namespaceId: 'chronobank',
        name: 'minute',
      },
      properties: [
        { name: 'divisibility', value: '2' },
        { name: 'initialSupply', value: '100000' },
        { name: 'supplyMutable', value: 'true' },
        { name: 'transferable', value: 'true' },
      ],
      levy: {},
    },
    namespace: 'cb:minutes',
    decimals: 2,
    name: 'XMIN',
    title: 'Minutes',
    symbol: 'XMIN',
  }]
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch(TokensActions.setTokensFetchingCount(currentCount + mosaics.length))
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    mosaics
      .map((m) => new NemDAO(m.name, m.symbol, nemProvider, m.decimals, m.definition, nem))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(TokensActions.tokenFetched(token))
        } catch (e) {
          dispatch(TokensActions.tokensLoadingFailed())
        }
      }),
  )
}

export const initWavesTokens = () => async (dispatch, getState) => {
  try {
    const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
    dispatch(TokensActions.setTokensFetchingCount(currentCount + 1))
    const dao = new WavesDAO(WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL, wavesProvider, WAVES_DECIMALS, 'WAVES')
    const waves = await dao.fetchToken()
    tokenService.registerDAO(waves, dao)
    dispatch(TokensActions.tokenFetched(waves))
    dispatch(initWavesAssetTokens(waves))
  } catch (e) {
    dispatch(TokensActions.tokensLoadingFailed())
  }
}

export const initWavesAssetTokens = (waves: TokenModel) => async (dispatch, getState) => {
  const state = getState()
  const { address } = selectWalletAddressByBlockchain(BLOCKCHAIN_NEM)(state)
  const { assets } = await dispatch(NemMiddlewareApi.requestNemBalanceByAddress(address))
  const currentCount = getState().get(DUCK_TOKENS).leftToFetch()
  dispatch(TokensActions.setTokensFetchingCount(currentCount + Object.keys(assets).length))
  // do not wait until initialized, it is ok to lazy load all the tokens
  return Promise.all(
    Object.keys(assets)
      .map((m) => new WavesDAO(m, m, wavesProvider, assets[m]['decimals'], assets[m]['id'], waves))
      .map(async (dao) => {
        try {
          const token = await dao.fetchToken()
          tokenService.registerDAO(token, dao)
          dispatch(TokensActions.tokenFetched(token))
        } catch (e) {
          dispatch(TokensActions.tokensLoadingFailed())
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
    dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_ETHEREUM, block))
  })
  const block = await ethereumDAO.getBlockNumber()
  dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_ETHEREUM, { blockNumber: block }))
}

export const estimateGasTransfer = (tokenId, params, gasPriceMultiplier = 1, address) => async (dispatch) => {
  const tokenDao = tokenService.getDAO(tokenId)
  const [to, amount] = params
  const tx = tokenDao.transfer(address, to, amount)
  const { gasLimit, gasFee, gasPrice } = await dispatch(estimateGas(tx))

  return {
    gasLimit,
    gasFee: new Amount(gasFee.mul(gasPriceMultiplier).toString(), ETH),
    gasPrice: new Amount(gasPrice.mul(gasPriceMultiplier).toString(), ETH),
  }
}
