/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO'
import { rebuildProfileTokens } from 'redux/session/actions'
import { getMainWallet } from 'redux/wallet/selectors'
import { getTokens } from 'redux/tokens/selectors'
import { getGasSliderCollection, getProfile } from 'redux/session/selectors/models'

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

export const getAddressesList = () => createSelector(
  [getMainWallet],
  (mainWallet: MainWalletModel) => {
    const addressesInWallet = mainWallet.addresses().list().toObject()
    let result = {}
    Object.keys(addressesInWallet).map((blockchain) => {
      result[blockchain] = addressesInWallet[blockchain].address()
    })
    return result
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

export const getProfileTokens = () => createSelector([getProfile, getTokens],
  (profile, tokens) => {
    return rebuildProfileTokens(profile, tokens)
  },
)
