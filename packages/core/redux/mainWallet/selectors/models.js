/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import AddressModel from '../../../models/wallet/AddressModel'
import { getAssetsHolderAssets } from '../../assetsHolder/selectors'
import { getTokens } from '../../tokens/selectors'
import { DUCK_MAIN_WALLET } from '../actions'

export const getWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET)
}

export const getWalletAddresses = (state) => {
  return state.get(DUCK_MAIN_WALLET).addresses()
}

export const getWalletAddress = (blockchain: string) => createSelector(
  [getWalletAddresses],
  (addresses) => {
    return blockchain ? addresses.item(blockchain) : new AddressModel()
  },
)

export const getDeposit = (tokenId) => createSelector(
  [getAssetsHolderAssets, getTokens],
  (assets, tokens) => {
    const token = tokens.item(tokenId)
    return assets.item(token.address()).deposit()
  },
)
