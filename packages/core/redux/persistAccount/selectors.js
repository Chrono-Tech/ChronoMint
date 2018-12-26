/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import {
  DEFAULT_ACTIVE_BLOCKCHAINS,
  DUCK_PERSIST_ACCOUNT, TREZOR_ACTIVE_BLOCKCHAINS,
} from './constants'
import {
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
} from '../../models/constants/AccountEntryModel'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getBlockchainList = (state) => {
  const account = getPersistAccount(state)
  return account.selectedWallet.blockchainList || DEFAULT_ACTIVE_BLOCKCHAINS
}

export const getSelectedWallet = (state) => {
  const account = getPersistAccount(state)
  return account.selectedWallet
}

export const getNetwork = (state) => {
  return state.get(DUCK_NETWORK)
}

export const getSelectedNetworkId = (state) => {
  const { selectedNetworkId } = getNetwork(state)
  return selectedNetworkId
}

export const getSelectedNetwork = (blockchain) => createSelector(
  getNetwork,
  (network) => {
    if (!network || !network.selectedNetworkId || !network.networks) {
      return null
    }

    if (blockchain) {
      const networks = network.networks.find(
        (item) => item.id === network.selectedNetworkId,
      )

      return networks[blockchain]
    } else {
      return network.networks.find(
        (item) => item.id === network.selectedNetworkId,
      )
    }
  },
)

export const getCustomNetworksList = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => persistAccount.customNetworksList,
)

export const getAddressListSent = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => persistAccount.addressListSent,
)

export const getSelectedWalletKey = createSelector(
  getPersistAccount,
  (account) => {
    return account.selectedWallet.key
  }
)

export const getAddressCache = createSelector(
  [getPersistAccount, getSelectedWalletKey],
  (account, selectedWalletKey) => {
    return account.addressCache[selectedWalletKey]
  }
)

export const getActiveBlockchainListByType = (walletType) => {
  switch (walletType) {
    case WALLET_TYPE_TREZOR:
    case WALLET_TYPE_TREZOR_MOCK:
      return TREZOR_ACTIVE_BLOCKCHAINS

    default:
      return DEFAULT_ACTIVE_BLOCKCHAINS
  }
}
