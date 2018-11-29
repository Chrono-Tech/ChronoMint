/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { BLOCKCHAIN_ETHEREUM } from '@chronobank/login/network/constants'
import { HolderModel, ContractDAOModel, ContractModel } from '../../models'
import { getEthereumSigner, getAddressCache } from '../persistAccount/selectors'
import ethereumDAO from '../../dao/EthereumDAO'
import { WALLETS_CACHE_ADDRESS } from '../persistAccount/constants'
import * as ethActions from './actions'
import * as Utils from './utils'
import WalletModel from '../../models/wallet/WalletModel'
import { WALLETS_SET } from '../wallets/constants'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import { DUCK_TOKENS } from '../tokens/constants'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { DAOS_REGISTER } from '../daos/constants'
import ERC20ManagerDAO from '../../dao/ERC20ManagerDAO'
import TokenModel from '../../models/tokens/TokenModel'
import { EVENT_ERC20_TOKENS_COUNT, EVENT_NEW_ERC20_TOKEN } from '../../dao/constants/ERC20ManagerDAO'
import TransactionHandler from '../abstractEthereum/utils/TransactionHandler'
import { web3Selector } from './selectors'
import { daoByAddress, daoByType } from '../daos/selectors'
import { BLOCKCHAIN_LABOR_HOUR, LHT, EVENT_NEW_BLOCK, ETH } from '../../dao/constants'
import laborHourDAO from '../../dao/LaborHourDAO'
import { getTokens } from '../tokens/selectors'

class EthereumTransactionHandler extends TransactionHandler {
  constructor () {
    super(BLOCKCHAIN_ETHEREUM)
    this.symbol = ETH
  }

  getDAO (entry, state) {
    return daoByAddress(entry.tx.to)(state) || ethereumDAO
  }

  getEstimateGasRequestFieldSet (tx, gasPrice, nonce, chainId) {
    const fields = super.getEstimateGasRequestFieldSet(tx, gasPrice, nonce)
    fields.chainId = chainId
    return fields
  }

  getWeb3 (state) {
    return web3Selector()(state)
  }
}

const transactionHandler = new EthereumTransactionHandler()
export const estimateGas = (tx, feeMultiplier = 1) => transactionHandler.estimateGas(tx, feeMultiplier)
export const executeTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })

export const initEthereum = ({ web3 }) => (dispatch) => {
  dispatch(ethActions.ethWeb3Update(new HolderModel({ value: web3 })))
}

export const updateWalletBalance = (wallet) => (dispatch) => {
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      try {
        dispatch({
          type: WALLETS_SET,
          wallet: new WalletModel({
            ...wallet,
            balances: {
              ...wallet.balances,
              ...formatBalances(wallet.blockchain, balancesResult),
            },
          }),
        })
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e.message)
      }
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error('call balances from middleware is failed getWalletBalances', e)
    })
}

export const enableEthereum = () => async (dispatch) => {
  dispatch(initTokens())
  dispatch(initWalletFromKeys())
}

export const initTokens = () => async (dispatch, getState) => {
  const state = getState()
  if (state.get(DUCK_TOKENS).isInited()) {
    return
  }
  const web3 = web3Selector()(state)
  ethereumDAO.connect(web3)
  laborHourDAO.connect(web3)

  dispatch(TokensActions.tokensInit())
  dispatch(TokensActions.setTokensFetchingCount(0))
  const erc20: ERC20ManagerDAO = daoByType('ERC20Manager')(state)

  erc20
    .on(EVENT_ERC20_TOKENS_COUNT, async (count) => {
      const currentCount = getTokens(getState()).leftToFetch()
      dispatch(TokensActions.setTokensFetchingCount(currentCount + count + 2 /*+eth+lht-lht(ERC20)*/))
      const ethLikeDAOs = [ethereumDAO, laborHourDAO]

      ethLikeDAOs.map(async (dao) => {
        const ethLikeToken: TokenModel = await dao.getToken()

        if (ethLikeToken) {
          dispatch(TokensActions.tokenFetched(ethLikeToken))
          tokenService.registerDAO(ethLikeToken, dao)
        }
      })
    })
    .on(EVENT_NEW_ERC20_TOKEN, (token: TokenModel) => {
      if (token.symbol() === LHT) {
        // eslint-disable-next-line no-console
        return console.warn(`Unsupported ERC20 token ${token.symbol()} received`)
      }

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

  dispatch(watchLatestBlock())
}

export const watchLatestBlock = () => async (dispatch) => {
  const daosMap = [
    {
      blockchain: BLOCKCHAIN_ETHEREUM,
      dao: ethereumDAO,
    },
    {
      blockchain: BLOCKCHAIN_LABOR_HOUR,
      dao: laborHourDAO,
    },
  ]

  await daosMap.map(async (daoData) => {
    daoData.dao.on(EVENT_NEW_BLOCK, (block) => {
      dispatch(TokensActions.setLatestBlock(daoData.blockchain, block))
    })
    const block = await daoData.dao.getBlockNumber()
    dispatch(TokensActions.setLatestBlock(daoData.blockchain, { blockNumber: block }))
  })
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }

  const signerSelectorsMap = {
    [BLOCKCHAIN_ETHEREUM]: {
      signerSelector: getEthereumSigner,
    },
  }

  Object.entries(signerSelectorsMap).map(async ([blockchain, { signerSelector }]) => {
    if (!addressCache[blockchain]) {
      const path = Utils.getEthereumDerivedPath(network[blockchain])
      const signer = signerSelector(state)
      if (signer) {
        const address = await signer.getAddress(path).toLowerCase()
        addressCache[blockchain] = {
          address,
          path,
        }

        dispatch({
          type: WALLETS_CACHE_ADDRESS,
          blockchain: blockchain,
          address,
          path,
        })
      }
    }

    const { address, path } = addressCache[blockchain]
    const wallet = new WalletModel({
      address: address.toLowerCase(),
      blockchain: blockchain,
      isMain: true,
      walletDerivedPath: path,
    })

    ethereumProvider.subscribe(wallet.address)
    dispatch({ type: WALLETS_SET, wallet })

    dispatch(updateWalletBalance(wallet))
  })
}
