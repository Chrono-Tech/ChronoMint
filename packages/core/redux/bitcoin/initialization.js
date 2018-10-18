/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  COIN_TYPE_BCC_MAINNET,
  COIN_TYPE_DASH_MAINNET,
  COIN_TYPE_LTC_MAINNET,
} from '@chronobank/login/network/constants'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import { EVENT_UPDATE_LAST_BLOCK } from '../../dao/constants'
import { bitcoinCashDAO, bitcoinDAO, dashDAO, litecoinDAO } from '../../dao/BitcoinDAO'
import { DUCK_TOKENS } from '../tokens/constants'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { accountCacheAddress } from '../persistAccount/actions'
import { getBitcoinDerivedPath } from './utils'
import { updateWalletBalance } from './thunks'
import { setWallet } from '../wallets/actions'
import { getBitcoinCashSigner, getBitcoinSigner, getLitecoinSigner } from './selectors'
import { getDashSigner } from '../dash/selectors'
import { getAddressCache } from '../persistAccount/selectors'
import WalletModel from '../../models/wallet/WalletModel'

const daoMap = {
  [BLOCKCHAIN_BITCOIN]: bitcoinDAO,
  [BLOCKCHAIN_BITCOIN_CASH]: bitcoinCashDAO,
  [BLOCKCHAIN_DASH]: dashDAO,
  [BLOCKCHAIN_LITECOIN]: litecoinDAO,
}

export const enableBlockchain = (blockchainName) => async (dispatch) => {
  if (!blockchainName || !daoMap[blockchainName]) {
    throw new Error(`Blockchain name is empty or not a BTC like: [${blockchainName}]`)
  }

  dispatch(initToken(blockchainName))
  dispatch(initWalletFromKeys(blockchainName))
}

const initToken = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const dao = daoMap[blockchainName]

  dao.on(EVENT_UPDATE_LAST_BLOCK, (newBlock) => {
    const blocks = state.get(DUCK_TOKENS).latestBlocks()
    const currentBlock = blocks[dao.getBlockchain()]
    if (currentBlock && newBlock.block.blockNumber > currentBlock.blockNumber) {
      dispatch(TokensActions.setLatestBlock(newBlock.blockchain, newBlock.block))
    }
  })
  await dao.watchLastBlock()
  dao.watch()
  const token = await dao.fetchToken()
  tokenService.registerDAO(token, dao)
  dispatch(TokensActions.tokenFetched(token))
  const currentBlock = await dao.getCurrentBlockHeight()
  dispatch(TokensActions.setLatestBlock(token.blockchain(), { blockNumber: currentBlock.currentBlock }))
}

const initWalletFromKeys = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)

  const addressCache = { ...getAddressCache(state) }

  const signerSelectorsMap = {
    [BLOCKCHAIN_BITCOIN]: {
      selector: getBitcoinSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN]),
    },
    [BLOCKCHAIN_BITCOIN_CASH]: {
      selector: getBitcoinCashSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_BITCOIN_CASH], COIN_TYPE_BCC_MAINNET),
    },
    [BLOCKCHAIN_DASH]: {
      selector: getDashSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_DASH], COIN_TYPE_DASH_MAINNET),
    },
    [BLOCKCHAIN_LITECOIN]: {
      selector: getLitecoinSigner,
      path: getBitcoinDerivedPath(network[BLOCKCHAIN_LITECOIN], COIN_TYPE_LTC_MAINNET),
    },
  }

  if (!addressCache[blockchainName]) {
    const { selector, path } = signerSelectorsMap[blockchainName]
    const signer = selector(state)
    if (signer) {
      const address = await signer.getAddress(path)
      addressCache[blockchainName] = {
        address,
        path,
      }

      dispatch(accountCacheAddress({ blockchainName, address, path }))
    }
  }

  const { address, path } = addressCache[blockchainName]
  const wallet = new WalletModel({
    address,
    blockchain: blockchainName,
    isMain: true,
    walletDerivedPath: path,
  })

  dispatch(setWallet(wallet))
  dispatch(updateWalletBalance(wallet))
}

export const disableBlockchain = (blockchainName) => async (dispatch) => {
  if (!blockchainName || !daoMap[blockchainName]) {
    throw new Error('Blockchain name is empty or not a BTC like')
  }

  // ...
}
