/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import MultisigWalletCollection from '@chronobank/core/models/wallet/MultisigWalletCollection'
import { getMultisigWallets } from '@chronobank/core/redux/wallet/selectors'
import OwnerModel from '@chronobank/core/models/wallet/OwnerModel'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import { DUCK_TOKENS } from '@chronobank/core/redux/tokens/actions'
import AddressModel from '@chronobank/core/models/wallet/AddressModel'
import { getMainWallets } from '@chronobank/core/redux/wallets/selectors/models'

// provides filtered list of addresses of MainWallets
export const selectWallet = () => createSelector(
  [
    getMultisigWallets,
  ],
  (multisigWallets: MultisigWalletCollection) => {
    return multisigWallets.list().map((wallet) => {
      return {
        address: wallet.address(),
        blockchain: wallet.blockchain(),
        name: wallet.name(),
        requiredSignatures: wallet.requiredSignatures && wallet.requiredSignatures(),
        pendingCount: wallet.pendingCount && wallet.pendingCount(),
        isMultisig: wallet.isMultisig(),
        isTimeLocked: wallet.isTimeLocked(),
        owners: wallet.owners ? wallet.owners().items().map((owner: OwnerModel) => owner.address()) : null,
        is2FA: wallet.is2FA(),
        isDerived: wallet.isDerived(),
        customTokens: wallet.customTokens ? wallet.customTokens() : null,
        releaseTime: wallet.releaseTime ? wallet.releaseTime() : null,
        isMain: false,
      }
    }).toArray()
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

export const getWalletCompactWalletsList = () => createWalletSelector(
  [
    selectWallet(),
  ],
  (
    wallets,
  ) => wallets,
)

const getSelectedTokenFromState = (state, props) => {
  const { selectedToken } = props
  const tokens = state.get(DUCK_TOKENS)
  return selectedToken && selectedToken.symbol ? tokens.item(selectedToken.symbol) : new TokenModel()
}

export const getSelectedToken = () => createWalletSelector(
  [getSelectedTokenFromState],
  (token) => {
    return token
  },
)

const getWalletAddress = (state, props) => {
  const { selectedToken } = props
  const wallets = getMainWallets(state)
  let selectedAddress
  wallets.some((wallet) => {
    if (selectedToken && selectedToken.blockchain === wallet.blockchain) {
      selectedAddress = wallet.address
    }
  })
  return selectedAddress || new AddressModel()
}

export const getSelectedWalletAddress = () => createSelector(
  [getWalletAddress],
  (address) => {
    return address
  },
)
