/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getEOSWallet } from './mainSelectors'
import { selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore } from '../../wallet/selectors/models'

export const EOSFilteredBalancesAndTokens = (walletId, symbol) => createSelector(
  [
    getEOSWallet(walletId),
  ],
  (
    wallet,
  ) => {
    if (!wallet) {
      return []
    }
    const balancesList = symbol
      ? Object.values(wallet.balances)
        .filter((balance) => {
          return symbol ? balance.symbol() === symbol : true
        })
      : Object.values(wallet.balances)

    return balancesList
      .map((balance) => {
        return {
          balance: balance,
        }
      })
  },
)

export const EOSTokensCountBalanceSelector = (walletId: string, symbol: string, notFilterZero: boolean) => createSelector(
  [
    EOSFilteredBalancesAndTokens(walletId, symbol),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          'symbol': symbol,
          'value': info.balance.toNumber(),
        }
      })
      .filter((balance) => {
        return notFilterZero ? true : balance.value > 0
      })
  },
)

export const EOSWalletAmountSelector = (walletId: string, symbol: string) => createSelector(
  [
    EOSTokensCountBalanceSelector(walletId, symbol, true),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo[0] ? balancesInfo[0].value : null
  },
)

export const EOSWalletTokensAndAmountsSelector = (walletId, symbol: string) => createSelector(
  [
    EOSFilteredBalancesAndTokens(walletId, symbol),
  ],
  (
    balancesInfo,
  ) => {
    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          [symbol]: info.balance.toNumber(),
        }
      })
      .sort((a, b) => {
        const oA = Object.keys(a)[0]
        const oB = Object.keys(b)[0]
        return (oA > oB) - (oA < oB)
      })
  },
)

export const EOSWalletBalanceSelector = (walletId, symbol) => createSelector(
  [
    EOSWalletTokensAndAmountsSelector(walletId, symbol),
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
        return accumulator + ((balance || 0) * (tokenPrice || 0))
      }, 0)
  },
)

export const EOSTokensCountBalanceAndPriceSelector = (walletId: string, symbol: string, notFilterZero: boolean) => createSelector(
  [
    EOSFilteredBalancesAndTokens(walletId, symbol),
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
          'value': info.balance.toNumber(),
          'valueUsd': info.balance.mul(tokenPrice || 0).toNumber(),
        }
      })
      .filter((balance) => {
        return notFilterZero ? true : balance.value > 0
      })
  },
)
