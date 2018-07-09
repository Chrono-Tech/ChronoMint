/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getTokens } from '../../tokens/selectors'
import { selectMainWalletBalancesListStore, selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore } from '../../wallet/selectors'
import { tokensAndAmountsSelector, tokensCountBalanceSelector } from './tokens'

export const filteredBalances = (blockchain: string, filterSymbol) => createSelector(
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
        return token && token.blockchain() === blockchain && (filterSymbol ? symbol === filterSymbol : true)
      })
  },
)

export const filteredBalancesAndTokens = (blockchain: string, symbol: string) => createSelector(
  [
    filteredBalances(blockchain, symbol),
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

const balanceCalculator = (blockchain: string, symbol: string) => createSelector(
  [
    tokensAndAmountsSelector(blockchain, symbol),
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

export const balanceSelector = (blockchain: string, symbol: string) => createSelector(
  [
    balanceCalculator(blockchain, symbol),
  ],
  (
    calculatedBalance,
  ) => {
    return calculatedBalance
  },
)

export const mainWalletBalanceSelector = (blockchain: string, symbol: string) => createSelector(
  [
    tokensCountBalanceSelector(blockchain, symbol, true),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo[0] ? balancesInfo[0].value : null
  },
)

export const mainWalletTokenBalanceSelector = (blockchain: string) => createSelector(
  [
    tokensCountBalanceSelector(blockchain),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
  },
)

export const tokensCountBalanceAndPriceSelector = (blockchain: string, symbol: string, notFilterZero: boolean = true) => createSelector(
  [
    filteredBalancesAndTokens(blockchain, symbol),
    selectMarketPricesSelectedCurrencyStore,
    selectMarketPricesListStore,
  ],
  (
    balancesInfo,
    selectedCurrency,
    priceList,
  ) => {

    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        const tokenPrice = priceList[symbol] && priceList[symbol][selectedCurrency] || null

        return {
          'symbol': symbol,
          'value': info.token.removeDecimals(info.balance.amount()).toNumber(),
          'valueUsd': info.token.removeDecimals(info.balance.amount()).mul(tokenPrice || 0).toNumber(),
        }
      })
      .filter((balance) => {
        return notFilterZero ? true : balance.value > 0
      })
      .toArray()
  },
)

export const mainWalletTokenBalanceWithPriceSelector = (blockchain: string) => createSelector(
  [
    tokensCountBalanceAndPriceSelector(blockchain),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
  },
)
