/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import MainWalletModel from '@chronobank/core/models/wallet/MainWalletModel'
import MultisigWalletCollection from '@chronobank/core/models/wallet/MultisigWalletCollection'
import { getMainWallet, getMultisigWallets } from '@chronobank/core/redux/wallet/selectors'
import BalanceModel from '@chronobank/core/models/tokens/BalanceModel'
import { getMainSymbolForBlockchain } from '@chronobank/core/redux/tokens/selectors'
import OwnerModel from '@chronobank/core/models/wallet/OwnerModel'

// provides filtered list of addresses of MainWallets
export const selectWallet = (blockchain, address) => createSelector(
  [
    getMainWallet,
    getMultisigWallets,
  ],
  (mainWallet: MainWalletModel, multisigWallets: MultisigWalletCollection) => {
    const mainSymbol = getMainSymbolForBlockchain(blockchain)
    const multisigWallet = multisigWallets.item(address)
    if (!multisigWallet) {
      const balance: BalanceModel = mainWallet.balances().item(mainSymbol)
      return {
        address,
        blockchain,
        name: mainWallet.name(blockchain, address),
        requiredSignatures: null,
        owners: null,
        releaseTime: null,
        pendingCount: null,
        isMultisig: false,
        isTimeLocked: false,
        is2FA: false,
        isDerived: false,
        customTokens: null,
        amount: balance.amount(),
        isMain: true,
      }
    }
    const balance: BalanceModel = multisigWallet.balances().item(mainSymbol)
    return {
      address,
      blockchain,
      name: multisigWallet.name(),
      requiredSignatures: multisigWallet.requiredSignatures && multisigWallet.requiredSignatures(),
      pendingCount: multisigWallet.pendingCount && multisigWallet.pendingCount(),
      isMultisig: multisigWallet.isMultisig(),
      isTimeLocked: multisigWallet.isTimeLocked(),
      owners: multisigWallet.owners ? multisigWallet.owners().items().map((owner: OwnerModel) => owner.address()) : null,
      is2FA: multisigWallet.is2FA(),
      isDerived: multisigWallet.isDerived(),
      customTokens: multisigWallet.customTokens ? multisigWallet.customTokens() : null,
      releaseTime: multisigWallet.releaseTime ? multisigWallet.releaseTime() : null,
      amount: balance.amount(),
      isMain: false,
    }
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

    let keysA = Object.keys(objA)
    let keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) {
      return false
    }

    // Test for A's keys different from B.
    let bHasOwnProperty = hasOwnProperty.bind(objB)
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
