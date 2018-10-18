/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { BLOCKCHAIN_WAVES } from '@chronobank/login/network/constants'
import { wavesProvider } from '@chronobank/login/network/WavesProvider'
import { getCurrentNetworkSelector } from '@chronobank/login/redux/network/selectors'
import * as TokensActions from '../tokens/actions'
import tokenService from '../../services/TokenService'
import { accountCacheAddress } from '../persistAccount/actions'
import { updateWalletBalance } from './thunks'
import { getWavesDerivedPath } from './utils'
import { setWallet } from '../wallets/actions'
import { getAddressCache } from '../persistAccount/selectors'
import WalletModel from '../../models/wallet/WalletModel'
import { getWavesSigner } from './selectors'

import { initWavesAssetTokens } from '../tokens/thunks'
import { WAVES_DECIMALS, WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL } from '../../dao/constants/WavesDAO'
import WavesDAO from '../../dao/WavesDAO'

export const enableBlockchain = () => async (dispatch) => {
  dispatch(initToken())
  dispatch(initWalletFromKeys())
}

const initToken = () => async (dispatch) => {

  const dao = new WavesDAO(WAVES_WAVES_NAME, WAVES_WAVES_SYMBOL, wavesProvider, WAVES_DECIMALS, 'WAVES')
  dao.watch()

  const waves = await dao.fetchToken()
  tokenService.registerDAO(waves, dao)
  dispatch(TokensActions.tokenFetched(waves))
  dispatch(initWavesAssetTokens(waves))
}

const initWalletFromKeys = (blockchainName) => async (dispatch, getState) => {
  const state = getState()
  const { network } = getCurrentNetworkSelector(state)

  const addressCache = { ...getAddressCache(state) }
  
  if (!addressCache[BLOCKCHAIN_WAVES]) {
    const { selector, path } = {
      signerSelector: getWavesSigner,
      path: getWavesDerivedPath(network[BLOCKCHAIN_WAVES]),
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
