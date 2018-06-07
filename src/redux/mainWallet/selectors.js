/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import AddressModel from 'models/wallet/AddressModel'
import { DUCK_MAIN_WALLET } from './actions'
import { getAssetsFromAssetHolder } from '../assetsHolder/selectors'
import { getTokens } from '../tokens/selectors'
import { selectMainWalletBalancesListStore, selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore } from '../wallet/selectors'

export const getWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET).addresses()
}

export const getWalletAddress = (blockchain: string) => createSelector(
  [getWallet],
  (addresses) => {
    return blockchain ? addresses.item(blockchain) : new AddressModel()
  },
)

export const getDeposit = (tokenId) => createSelector(
  [getAssetsFromAssetHolder, getTokens],
  (assets, tokens) => {
    const token = tokens.item(tokenId)
    return assets.item(token.address()).deposit()
  },
)

export const filteredBalances = (blockchain: string) => createSelector(
  [
    selectMainWalletBalancesListStore,
    getTokens,
  ],
  (
    balances,
    tokens,
  ) => {
    return balances
      .filter((balance) => {
        const symbol = balance.symbol()
        const token = symbol && tokens.item(symbol)
        return token && token.blockchain() === blockchain
      })
  },
)

export const filteredBalancesAndTokens = (blockchain: string) => createSelector(
  [
    filteredBalances(blockchain),
    getTokens,
  ],
  (
    balances,
    tokens,
  ) => {
    return balances
      .map((balance) => {
        return {
          balance: balance,
          token: tokens.item(balance.symbol()),
        }
      })
  },
)

export const tokensAndAmountsSelector = (blockchain: string) => createSelector(
  [
    filteredBalancesAndTokens(blockchain),
  ],
  (
    balancesInfo,
  ) => {

    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          [symbol]: info.token.removeDecimals(info.balance.amount()).toNumber(),
        }
      })
      .sort((a, b) => {
        const oA = Object.keys(a)[0]
        const oB = Object.keys(b)[0]
        return (oA > oB) - (oA < oB)
      })
      .toArray()
  },
)

const balanceCalculator = (blockchain: string) => createSelector(
  [
    tokensAndAmountsSelector(blockchain),
    selectMarketPricesSelectedCurrencyStore,
    selectMarketPricesListStore,
  ],
  (
    balances,
    selectedCurrency,
    priceList,
  ) => {
    return balances
      .reduce((accumulator, tokenBalance) => {
        const symbol = Object.keys(tokenBalance)[0]
        const balance = Object.values(tokenBalance)[0]
        const tokenPrice = priceList[symbol] && priceList[symbol][selectedCurrency] || null
        accumulator += ((balance || 0) * (tokenPrice || 0))
        return accumulator
      }, 0)
  },
)

export const balanceSelector = (blockchain: string) => createSelector(
  [
    balanceCalculator(blockchain),
  ],
  (
    calculatedBalance,
  ) => {
    return calculatedBalance
  },
)

export const tokensCountBalanceSelector = (blockchain: string) => createSelector(
  [
    filteredBalancesAndTokens(blockchain),
  ],
  (
    balancesInfo,
  ) => {

    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          'symbol': symbol,
          'value': info.token.removeDecimals(info.balance.amount()).toNumber(),
        }
      })
      .filter((balance) => {
        return balance.value > 0
      })
      .toArray()
  },
)

export const tokensCountSelector = (blockchain: string) => createSelector(
  [
    tokensCountBalanceSelector(blockchain),
  ],
  (
    balances,
  ) => {
    return balances.length
  },
)
