/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { selectMarketPrices, selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { getAllTokens } from '../../tokens/selectors'
import { getWalletById } from './models'
import { PTWallet } from '../../wallet/types'
import { getEthMultisigWallet } from '../../multisigWallet/selectors/models'
import { getEOSWallet } from '../../eos/selectors/mainSelectors'
import { getWalletById as getLHTWallet } from '../../laborHour/selectors'

export const filteredBalancesAndTokens = (walletId, symbol) =>
  createSelector(
    [
      getAllTokens,
      getWalletById(walletId),
      getEthMultisigWallet(walletId),
      getEOSWallet(walletId),
      getLHTWallet(walletId),
    ],
    (tokens, wallet, ethMultisigWallet, eosWallet, lhtWallet) => {
      if (!wallet && !ethMultisigWallet && !eosWallet && !lhtWallet) {
        return []
      }
      const resWallet = wallet || ethMultisigWallet || eosWallet || lhtWallet
      return Object.values(resWallet.balances)
        .filter((balance) => {
          if (tokens.item(balance.symbol()).isFetched()) {
            return symbol ? balance.symbol() === symbol : true
          } else {
            return false
          }
        })
        .map((balance) => {
          return {
            balance: balance,
            token: tokens.item(balance.symbol()),
          }
        })
    },
  )

export const walletTokensAndAmountsSelector = (walletId, symbol: string) =>
  createSelector([filteredBalancesAndTokens(walletId, symbol)], (balancesInfo) => {
    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          [symbol]: info.token.removeDecimals(info.balance).toNumber(),
        }
      })
      .sort((a, b) => {
        const oA = Object.keys(a)[0]
        const oB = Object.keys(b)[0]
        return (oA > oB) - (oA < oB)
      })
  })

export const multisigTokensCountSelector = (address: string) =>
  createSelector([tokensCountBalanceSelector(address)], (balances) => {
    return balances.length
  })

const balanceCalculator = (walletId, symbol) =>
  createSelector(
    [walletTokensAndAmountsSelector(walletId, symbol), selectCurrentCurrency, selectMarketPrices],
    (balances, selectedCurrency, priceList) => {
      return balances.reduce((accumulator, tokenBalance) => {
        const symbol = Object.keys(tokenBalance)[0]
        const balance = Object.values(tokenBalance)[0]
        const tokenPrice = (priceList[symbol] && priceList[symbol][selectedCurrency]) || null
        return accumulator + (balance || 0) * (tokenPrice || 0)
      }, 0)
    },
  )

export const walletBalanceSelector = (walletId: string, symbol: string) =>
  createSelector([balanceCalculator(walletId, symbol)], (calculatedBalance) => {
    return calculatedBalance
  })

export const tokensCountBalanceSelector = (walletId: string, symbol: string, notFilterZero: boolean) =>
  createSelector([filteredBalancesAndTokens(walletId, symbol)], (balancesInfo) => {
    return balancesInfo
      .map((info) => {
        const symbol = info.balance.symbol()
        return {
          symbol: symbol,
          value: info.token.removeDecimals(info.balance).toNumber(),
        }
      })
      .filter((balance) => {
        return notFilterZero ? true : balance.value > 0
      })
  })

export const walletAmountSelector = (walletId: string, symbol: string) =>
  createSelector([tokensCountBalanceSelector(walletId, symbol, true)], (balancesInfo) => {
    return balancesInfo[0] ? balancesInfo[0].value : null
  })

export const walletTokensAmountSelector = (walletId: string) =>
  createSelector([tokensCountBalanceSelector(walletId)], (balancesInfo) => {
    return balancesInfo
  })

export const tokensCountBalanceAndPriceSelector = (walletId: string, symbol: string, notFilterZero: boolean) =>
  createSelector(
    [filteredBalancesAndTokens(walletId, symbol), selectCurrentCurrency, selectMarketPrices],
    (balancesInfo, selectedCurrency, priceList) => {
      return balancesInfo
        .map((info) => {
          const symbol = info.balance.symbol()
          const tokenPrice = (priceList[symbol] && priceList[symbol][selectedCurrency]) || null

          return {
            symbol: symbol,
            value: info.token.removeDecimals(info.balance).toNumber(),
            valueUsd: info.token
              .removeDecimals(info.balance)
              .mul(tokenPrice || 0)
              .toNumber(),
          }
        })
        .filter((balance) => {
          return notFilterZero ? true : balance.value > 0
        })
    },
  )

export const walletTokensAmountAndBalanceSelector = (wallet: PTWallet) =>
  createSelector([tokensCountBalanceAndPriceSelector(wallet, null, true)], (balancesInfo) => {
    return balancesInfo
  })

export const tokensCountSelector = (walletId: string) =>
  createSelector([tokensCountBalanceSelector(walletId)], (balances) => {
    return balances.length
  })
