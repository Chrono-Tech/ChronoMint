/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import { getMainSymbolForBlockchain } from '../../../redux/tokens/selectors'
import { getWallets } from './models'
import WalletModel from '../../../models/wallet/WalletModel'
import Amount from '../../../models/Amount'
import { getEthMultisigWallets } from '../../multisigWallet/selectors/models'

// provides filtered list of addresses of MainWallets
export const selectWallet = (blockchain, address) => createSelector(
  [
    getWallets,
    getEthMultisigWallets,
  ],
  (wallets, ethMultisigWallets) => {
    const walletId = `${blockchain}-${address}`
    let wallet: WalletModel = wallets[walletId]
    if (!wallet) {
      wallet = ethMultisigWallets.item(walletId)
    }
    const mainSymbol = getMainSymbolForBlockchain(blockchain)

    const balance: Amount = wallet ? wallet.balances[mainSymbol] : new Amount(0, mainSymbol)
    return new WalletModel({
      ...wallet,
      amount: balance,
    })
  },
)

const createWalletSelector = createSelectorCreator(
  defaultMemoize,
  (objA, objB) => {
    if (objA === objB) {
      return true
    }

    if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
      return false
    }

    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    const bHasOwnProperty = hasOwnProperty.bind(objB)
    for (let i = 0; i < keysA.length; i++) {
      if (!bHasOwnProperty(keysA[i]) || objA[keysA[i]] !== objB[keysA[i]]) {
        return false
      }
    }

    return true
  },
)

export const getWalletInfo = (blockchain, address) => createWalletSelector(
  [
    selectWallet(blockchain, address),
  ],
  (
    wallet,
  ) => wallet,
)
