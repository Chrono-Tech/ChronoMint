/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_MULTISIG_WALLET } from 'redux/multisigWallet/actions'
import { filteredBalancesAndTokens, tokensCountBalanceSelector } from './balances'

export const getWallets = (state) => {
  return state.get(DUCK_MULTISIG_WALLET)
}

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

export const multisigTokensCountSelector = (address: string) => createSelector(
  [
    tokensCountBalanceSelector(address),
  ],
  (
    balances,
  ) => {
    return balances.length
  },
)
