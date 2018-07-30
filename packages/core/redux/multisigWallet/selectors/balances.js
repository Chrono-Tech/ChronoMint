/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getTokens } from '../../tokens/selectors'
import { selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore } from '../../wallet/selectors'
import { getWallet } from './models'

export const multisigTokensAndAmountsSelector = (address: string, symbol: string) => createSelector(
  [
    filteredBalancesAndTokens(address, symbol),
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

export const filteredBalancesAndTokens = (address, symbol: string) => createSelector(
  [
    getWallet(address),
    getTokens,
  ],
  (
    wallet,
    tokens,
  ) => {
    return wallet.balances()
      .list()
      .filter((balance) => symbol ? balance.symbol() === symbol : true)
      .map((balance) => {
        return {
          balance: balance,
          token: tokens.item(balance.symbol()),
        }
      })
  },
)

const balanceCalculator = (address: string, symbol: string) => createSelector(
  [
    multisigTokensAndAmountsSelector(address, symbol),
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

export const multisigBalanceSelector = (address: string, symbol: string) => createSelector(
  [
    balanceCalculator(address, symbol),
  ],
  (
    calculatedBalance,
  ) => {
    return calculatedBalance
  },
)

export const tokensCountBalanceSelector = (address: string, symbol: string, notFilterZero: boolean) => createSelector(
  [
    filteredBalancesAndTokens(address, symbol),
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
        return notFilterZero ? true : balance.value > 0
      })
      .toArray()
  },
)

export const multisigWalletBalanceSelector = (address: string, symbol: string) => createSelector(
  [
    tokensCountBalanceSelector(address, symbol, true),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo[0] ? balancesInfo[0].value : null
  },
)

export const multisigWalletTokenBalanceSelector = (address: string) => createSelector(
  [
    tokensCountBalanceSelector(address),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
  },
)

export const tokensCountBalanceAndPriceSelector = (blockchain: string, symbol: string, notFilterZero: boolean) => createSelector(
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

export const multisigWalletTokenBalanceWithPriceSelector = (blockchain: string) => createSelector(
  [
    tokensCountBalanceAndPriceSelector(blockchain),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
  },
)
