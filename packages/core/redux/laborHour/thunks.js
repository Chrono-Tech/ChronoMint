/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { laborHourProvider } from '@chronobank/login/network/LaborHourProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { getNetworkById } from '@chronobank/login/network/settings'
import web3Factory from '../../../core/web3'

import { HolderModel } from '../../models'
import { BLOCKCHAIN_LABOR_HOUR, EVENT_NEW_BLOCK } from '../../dao/constants'
import laborHourDAO from '../../dao/LaborHourDAO'
import TransactionHandler from '../abstractEthereum/utils/TransactionHandler'
import { laborHourWeb3Update } from './actions'
import { web3Selector } from './selectors'
import { getEthereumSigner } from '../ethereum/selectors'
import { getAddressCache } from '../persistAccount/selectors'

import { WALLETS_SET, WALLETS_UNSET } from '../wallets/constants'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import WalletModel from '../../models/wallet/WalletModel'
import { formatBalances, getWalletBalances } from '../tokens/utils'
import * as Utils from '../ethereum/utils'
import { DUCK_PERSIST_ACCOUNT, WALLETS_CACHE_ADDRESS } from '../persistAccount/constants'
import { getWalletsByBlockchain } from '../wallets/selectors/models'

class LaborHourTransactionHandler extends TransactionHandler {
  constructor () {
    super(BLOCKCHAIN_LABOR_HOUR)
    this.web3 = null
  }

  getDAO () {
    return laborHourDAO
  }

  getWeb3 (state) {
    if(this.web3 === null) {
      this.web3 = web3Selector()(state)
    }

    return this.web3
  }
}

const transactionHandler = new LaborHourTransactionHandler()
export const estimateLaborHourGas = (tx, feeMultiplier = 1) => {
  return transactionHandler.estimateGas(tx, feeMultiplier)
}
export const executeLaborHourTransaction = ({ tx, options }) => transactionHandler.executeTransaction({ tx, options })
export const initLaborHour = ({ web3 }) => (dispatch) => dispatch(laborHourWeb3Update(new HolderModel({ value: web3 })))

export const enableLaborHour = () => async (dispatch, getState) => {
  const state = getState()
  const { selectedNetworkId, selectedProviderId } = state.get(DUCK_NETWORK)
  const { customNetworksList } = state.get(DUCK_PERSIST_ACCOUNT)

  let network = getNetworkById(selectedNetworkId, selectedProviderId)
  if (!network.id) {
    network = customNetworksList.find((network) => network.id === selectedNetworkId)
  }

  dispatch(initLaborHour({ web3: web3Factory(network[BLOCKCHAIN_LABOR_HOUR]) }))

  await dispatch(initTokens())
  dispatch(initWalletFromKeys())
}

export const initTokens = () => async (dispatch, getState) => {
  const state = getState()
  const web3 = web3Selector()(state)

  laborHourDAO.connect(web3)

  const lhtToken = await laborHourDAO.getToken()
  tokenService.registerDAO(lhtToken, laborHourDAO)
  dispatch(TokensActions.tokenFetched(lhtToken))

  dispatch(watchLatestBlock())
}

export const watchLatestBlock = () => async (dispatch) => {

  laborHourDAO.on(EVENT_NEW_BLOCK, (block) => {
    dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_LABOR_HOUR, block))
  })

  const block = await laborHourDAO.getBlockNumber()
  dispatch(TokensActions.setLatestBlock(BLOCKCHAIN_LABOR_HOUR, { blockNumber: block }))
}

const initWalletFromKeys = () => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)
  const addressCache = { ...getAddressCache(state) }

  if (!addressCache[BLOCKCHAIN_LABOR_HOUR]) {
    const path = Utils.getEthereumDerivedPath(network[BLOCKCHAIN_LABOR_HOUR])
    const signer = getEthereumSigner(state)
    if (signer) {
      const address = await signer.getAddress(path)
      addressCache[BLOCKCHAIN_LABOR_HOUR] = {
        address,
        path,
      }

      dispatch({
        type: WALLETS_CACHE_ADDRESS,
        blockchain: BLOCKCHAIN_LABOR_HOUR,
        address,
        path,
      })
    }
  }

  const { address, path } = addressCache[BLOCKCHAIN_LABOR_HOUR]
  const wallet = new WalletModel({
    address,
    blockchain: BLOCKCHAIN_LABOR_HOUR,
    isMain: true,
    walletDerivedPath: path,
  })

  laborHourProvider.subscribe(wallet.address)
  dispatch({ type: WALLETS_SET, wallet })

  dispatch(updateWalletBalance(wallet))
}

export const updateWalletBalance = (wallet) => (dispatch) => {
  getWalletBalances({ wallet })
    .then((balancesResult) => {
      try {
        dispatch({ type: WALLETS_SET, wallet: new WalletModel({
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

export const disableLaborHour = () => async (dispatch, getState) => {
  const wallets = getWalletsByBlockchain(BLOCKCHAIN_LABOR_HOUR)(getState())

  wallets.forEach((wallet) => {
    laborHourProvider.unsubscribe(wallet.address)
    dispatch({ type: WALLETS_UNSET, wallet })
  })

  laborHourDAO.removeAllListeners()
  laborHourDAO.disconnect()
}
