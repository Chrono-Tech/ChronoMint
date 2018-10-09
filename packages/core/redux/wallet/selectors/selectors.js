/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { getWallets } from '../../wallets/selectors/models'
import { getTokens } from '../../tokens/selectors'
import { selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore } from './models'
import { getEthMultisigWallets } from '../../multisigWallet/selectors/models'

export const getWalletTokens = (walletId: string, isAmountGt: boolean) => {
  return createSelector(
    [
      getWallets,
      getEthMultisigWallets,
      getTokens,
      selectMarketPricesListStore,
      selectMarketPricesSelectedCurrencyStore,
    ],
    (
      wallets,
      ethMultisigWallets,
      tokens,
      prices,
      selectedCurrency,
    ) => {

      /**
       * Internal utility
       * @private
       */
      const convertAmountToNumber = (symbol, amount) =>
        tokens
          .item(symbol)
          .removeDecimals(amount)
          .toNumber()

      if (!wallets) return null

      const wallet = wallets[walletId] || ethMultisigWallets.item(walletId)

      const customTokens = wallet.customTokens
      const balances = Object.values(wallet.balances || {})

      const walletTokensAndBalanceByAddress = balances
        .filter((balance) => balance.symbol() === "ETH" || (customTokens ? customTokens.includes(balance.symbol()) : true))
        .filter((balance) => tokens.item(balance.symbol()).isFetched())
        .map((balance) => {
          const bAmount = balance
          const bSymbol = balance.symbol()
          const tAmount = convertAmountToNumber(bSymbol, bAmount)
          const tokenAmountKeyValuePair = {}
          tokenAmountKeyValuePair[bSymbol] = tAmount
          return {
            symbol: bSymbol,
            amount: tAmount,
          }
        })

      const arrWalletTokensAndBalanceByAddress = [...walletTokensAndBalanceByAddress.values()]
      return arrWalletTokensAndBalanceByAddress
        .reduce((accumulator, tokenKeyValuePair) => {
          const { amount, symbol } = tokenKeyValuePair
          if (isAmountGt && amount <= 0) {
            return accumulator
          }

          const tokenPrice = prices[symbol] && prices[symbol][selectedCurrency] || 0
          if (tokenPrice && amount > 0) {
            accumulator.balance += (amount * tokenPrice)
          }
          accumulator.tokens.push({
            symbol: symbol,
            amount: amount,
            amountPrice: amount * tokenPrice,
          })
          accumulator.tokens = accumulator.tokens.sort((a, b) => {
            const oA = a.symbol
            const oB = b.symbol
            return (oA > oB) - (oA < oB)
          }) // sort by blocakchains titles (TODO: it does not effective to resort whole array each time in reduce, need better place...)
          return accumulator
        }, {
          balance: 0,
          tokens: [],
        })
    },
  )
}

export const walletInfoSelector = (wallet, isAmountGt, state) => {
  return getWalletTokens(wallet.id, isAmountGt)(state)
}
