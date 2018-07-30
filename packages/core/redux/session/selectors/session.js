/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { PROFILE_PANEL_TOKENS } from '../actions'
import { getMainWallets } from '../../wallets/selectors/models'
import { getGasSliderCollection, getIsCBE } from './models'
import WalletModel from '../../../models/wallet/WalletModel'

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

export const getAddressesList = () => createSelector(
  [getMainWallets],
  (wallets: Array<WalletModel>) => {
    return wallets
      .reduce((accumulator, wallet: WalletModel) => {
        accumulator[wallet.blockchain] = wallet.address
        return accumulator
      }, {})
  },
)

export const getBlockchainAddressesList = () => createSelector(
  [getAddressesList()],
  (addresses) => {
    let result = []
    PROFILE_PANEL_TOKENS
      .map((token) => {
        result.push({
          ...token,
          address: addresses[token.blockchain],
        })
      })
    return result
  },
)

export const isCBE = () => createSelector(
  [getIsCBE],
  (isCBE) => isCBE,
)
