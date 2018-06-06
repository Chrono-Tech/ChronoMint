/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import MainWalletModel from 'models/wallet/MainWalletModel'
import { MANDATORY_TOKENS, PROFILE_PANEL_TOKENS } from 'dao/ERC20ManagerDAO'
import { DUCK_SESSION, rebuildProfileTokens } from './actions'
import { getMainWallet } from '../wallet/selectors'
import { getTokens } from '../tokens/selectors'

export const getAccount = (state) => {
  const { account } = state.get(DUCK_SESSION)
  return account
}

export const getProfile = (state) => {
  const { profile } = state.get(DUCK_SESSION)
  return profile
}

export const getGasSliderCollection = (state) => {
  const { gasPriceMultiplier } = state.get(DUCK_SESSION)
  return gasPriceMultiplier
}

export const getGasPriceMultiplier = (blockchain) => createSelector([getGasSliderCollection],
  (gasSliderCollection) => {
    return gasSliderCollection.get(blockchain) || 1
  },
)

// Permanent reference to a functor to improve selector performance
export const BALANCES_COMPARATOR_SYMBOL = (item1, item2) => {
  const s1 = item1.balance.symbol()
  const s2 = item2.balance.symbol()
  return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0)
}
export const BALANCES_COMPARATOR_URGENCY = (item1, item2) => {
  const m1 = MANDATORY_TOKENS.includes(item1.token.symbol())
  const m2 = MANDATORY_TOKENS.includes(item2.token.symbol())
  const urgency = m2 - m1
  if (urgency !== 0) {
    return urgency
  }
  const s1 = item1.balance.symbol()
  const s2 = item2.balance.symbol()
  return s1 < s2 ? -1 : (s1 > s2 ? 1 : 0)
}

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
