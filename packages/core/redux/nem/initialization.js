/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_NEM } from '@chronobank/login/network/constants'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { accountCacheAddress } from '../persistAccount/actions'
import { updateWalletBalance } from './thunks'
import { getNemDerivedPath } from './utils'
import { setWallet } from '../wallets/actions'
import { getAddressCache } from '../persistAccount/selectors'
import WalletModel from '../../models/wallet/WalletModel'
import { getNemSigner } from './selectors'

import { NEM_DECIMALS, NEM_XEM_NAME, NEM_XEM_SYMBOL } from '../../dao/constants/NemDAO'
import NemDAO from '../../dao/NemDAO'
import { initNemMosaicTokens } from '../tokens/thunks'

export const enableBlockchain = () => async (dispatch) => {
  dispatch(initToken())
  dispatch(initWalletFromKeys())
}

const initToken = () => async (dispatch) => {

  const dao = new NemDAO(NEM_XEM_NAME, NEM_XEM_SYMBOL, nemProvider, NEM_DECIMALS)
  dao.watch()

  const nem = await dao.fetchToken()
  await dispatch(initNemMosaicTokens(nem))
  tokenService.registerDAO(nem, dao)
  dispatch(TokensActions.tokenFetched(nem))
}

const initWalletFromKeys = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)

  const addressCache = { ...getAddressCache(state) }
  
  if (!addressCache[BLOCKCHAIN_NEM]) {
    const { selector, path } = {
      signerSelector: getNemSigner,
      path: getNemDerivedPath(network[BLOCKCHAIN_NEM]),
    }
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
  dispatch(updateWalletBalance({ wallet }))
}

export const disableBlockchain = () => async (dispatch) => {
  // ...
}
