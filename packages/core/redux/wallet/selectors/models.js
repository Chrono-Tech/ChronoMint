/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_MAIN_WALLET } from '../../mainWallet/actions'
import { DUCK_MULTISIG_WALLET } from '../../multisigWallet/actions'
import { DUCK_MARKET } from '../../market/actions'
import { DUCK_TOKENS } from '../../tokens/actions'

/**
 * SIMPLE SELECTORS
 * ==============================================================================
 */

export const getMainWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET)
}

export const getMultisigWallets = (state) => {
  return state.get(DUCK_MULTISIG_WALLET)
}

export const selectTokensStore = (state) =>
  state.get(DUCK_TOKENS) // TokensCollection, array of TokenModel

export const selectMarketPricesListStore = (state) => state.get(DUCK_MARKET).prices
export const selectMarketPricesSelectedCurrencyStore = (state) => state.get(DUCK_MARKET).selectedCurrency

