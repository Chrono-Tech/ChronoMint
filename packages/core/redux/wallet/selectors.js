/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_MULTISIG_WALLET } from '../multisigWallet/actions'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import Amount from '../../models/Amount'
import { getMainWallet, getMultisigWallets, selectMarketPricesListStore, selectMarketPricesSelectedCurrencyStore, selectTokensStore } from './selectors/models'

export {
  getMultisigWallets,
  selectTokensStore,
  selectMarketPricesListStore,
  selectMarketPricesSelectedCurrencyStore,
}

export const getDeriveWalletsAddresses = (state, blockchain) => {
  let accounts = []
  state.get(DUCK_MULTISIG_WALLET)
    .list()
    .map((wallet) => {
      if (wallet instanceof DerivedWalletModel && wallet.blockchain() === blockchain) {
        accounts.push(wallet.address())
      }
    })
  return accounts
}

export const getIsHave2FAWallets = (state) => {
  return state.get(DUCK_MULTISIG_WALLET)
    .list()
    .some((wallet) => {
      if (wallet.is2FA()) {
        return true
      }
    })
}

export const getWallet = (blockchain, address) => createSelector(
  [
    getMainWallet,
    getMultisigWallets,
  ],
  (mainWallet, multisigWallets) => {
    const multisigWallet = multisigWallets.item(address)
    if (multisigWallet) {
      return multisigWallet
    }
    else {
      return mainWallet
    }

  },
)

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
    getMainWallet,
    getMultisigWallets,
  ],
  (
    mainWalletState,
    multisigWalletsCollection,
  ) => {
    if (multisigWalletsCollection.item(address)) {
      return multisigWalletsCollection.item(address).transactions()
    } else {
      return mainWalletState.transactions({ blockchain, address })
    }
  },
)

export const getWalletBalanceForSymbol = (address, blockchain, symbol) => createSelector(
  [getWallet(blockchain, address)],
  (currentWallet) => {
    return currentWallet.balances().item(symbol)
  },
)
