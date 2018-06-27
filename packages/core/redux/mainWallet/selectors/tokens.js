/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { filteredBalancesAndTokens } from './balances'
import { getMainWallet } from '../../wallet/selectors/models'

export const tokensAndAmountsSelector = (blockchain: string, symbol: string) => createSelector(
  [
    filteredBalancesAndTokens(blockchain, symbol),
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

export const tokensCountBalanceSelector = (blockchain: string, symbol: string, notFilterZero: boolean) => createSelector(
  [
    filteredBalancesAndTokens(blockchain, symbol),
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

export const pendingTransactionsSelector = () => createSelector(
  [
    getMainWallet,
  ],
  (
    mainWallet,
  ) => {
    return mainWallet.getAllPendingTransactions()
  },
)
