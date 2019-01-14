/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { selectMarketPrices, selectCurrentCurrency } from '@chronobank/market/redux/selectors'
import { DUCK_ETH_MULTISIG_WALLET } from '../multisigWallet/constants'
import DerivedWalletModel from '../../models/wallet/DerivedWalletModel'
import Amount from '../../models/Amount'
import { getMultisigWallets, selectTokensStore } from './selectors/models'
import { getWallet } from '../wallets/selectors/models'
import { getEthMultisigWallet } from '../multisigWallet/selectors/models'
import { getEOSWallet } from '../eos/selectors/mainSelectors'

export {
  getMultisigWallets,
  selectTokensStore,
  selectMarketPrices,
  selectCurrentCurrency,
}

export const getDeriveWalletsAddresses = (state, blockchain) => {
  const accounts = []
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
    selectCurrentCurrency,
    selectMarketPrices,
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
    getWallet(blockchain, address),
    getEthMultisigWallet(`${blockchain}-${address}`),
    getEOSWallet(`${blockchain}-${address}`),
  ],
  (wallet, ethMultisigWallet, eosWallet) => {
    const selectedWallet = wallet || ethMultisigWallet || eosWallet
    if (selectedWallet) {
      return selectedWallet.transactions.transactions
    }
    return []
  },
)

export const getWalletBalanceForSymbol = (address, blockchain, symbol) => createSelector(
  [getWallet(blockchain, address)],
  (currentWallet) => {
    return currentWallet.balances[symbol]
  },
)
