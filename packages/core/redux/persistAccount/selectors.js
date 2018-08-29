/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from './constants'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorDeviceMock'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getSigner = (state) => {
  const { decryptedWallet } = getPersistAccount(state)
  return decryptedWallet
}

export const getNetwork = (state) => {
  return state.get(DUCK_NETWORK)
}

export const getSelectedNetworkId = (state) => {
  const { selectedNetworkId } = getNetwork(state)
  return selectedNetworkId
}

export const getSelectedNetwork = () => createSelector(
  getNetwork,
  (network) => {
    if (!network.selectedNetworkId) {
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId,
    )
  },
)

export const getCustomNetworksList = createSelector(
  (state) => state.get(DUCK_PERSIST_ACCOUNT),
  (persistAccount) => persistAccount.customNetworksList,
)

export const getBtcSigner = (state) => {
  const account = getPersistAccount(state)
  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case 'trezor_mock': {
      return new BitcoinTrezorDeviceMock()
    }
    case 'memory': {
      return new BitcoinMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}
