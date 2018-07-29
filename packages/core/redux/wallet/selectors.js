/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_ETH_MULTISIG_WALLET } from '../multisigWallet/constants'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import Amount from '../../models/Amount'
import { getMultisigWallets, selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore, selectTokensStore } from './selectors/models'
import { getWallet } from '../wallets/selectors/models'
import { getEthMultisigWallet } from '../multisigWallet/selectors/models'

export {
  getMultisigWallets,
  selectTokensStore,
  selectMarketPricesListStore,
  selectMarketPricesSelectedCurrencyStore,
}

export const getDeriveWalletsAddresses = (state, blockchain) => {
  let accounts = []
  state.get(DUCK_ETH_MULTISIG_WALLET)
    .list()
    .map((wallet) => {
      if (wallet instanceof DerivedWalletModel && wallet.blockchain() === blockchain) {
        accounts.push(wallet.address())
      }
    })
  return accounts
}

export const getIsHave2FAWallets = (state) => {
  return state.get(DUCK_ETH_MULTISIG_WALLET)
    .list()
    .some((wallet) => {
      if (wallet.is2FA()) {
        return true
      }
    })
}

const priceCalculator = (symbol: string) => createSelector(
  [
    selectMarketPricesSelectedCurrencyStore,
    selectMarketPricesListStore,
  ],
  (
    selectedCurrency,
    priceList,
  ) => {
    return priceList[symbol] && priceList[symbol][selectedCurrency] || null
  },
)

export const priceTokenSelector = (value: Amount) => createSelector(
  [
    priceCalculator(value.symbol()),
  ],
  (
    price,
  ) => {
    return price
  },
)

export const makeGetTxListForWallet = (blockchain: string, address: string) => createSelector(
  [
    getWallet(`${blockchain}-${address}`),
    getEthMultisigWallet(`${blockchain}-${address}`),
  ],
  (wallet, ethMultisigWallet) => {
    return (wallet || ethMultisigWallet).transactions.transactions
  },
)

export const getWalletBalanceForSymbol = (address, blockchain, symbol) => createSelector(
  [getWallet(`${blockchain}-${address}`)],
  (currentWallet) => {
    return currentWallet.balances().item(symbol)
  },
)
