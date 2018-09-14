/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NODES } from '@chronobank/nodes/redux/constants'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_LEDGER_MOCK,
} from '../../models/constants/AccountEntryModel'
import { DUCK_PERSIST_ACCOUNT } from './constants'

import EthereumTrezorDeviceMock from '../../services/signers/EthereumTrezorDeviceMock'
import EthereumLedgerDeviceMock from '../../services/signers/EthereumLedgerDeviceMock'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getEthereumSigner = (state) => {
  const account = getPersistAccount(state)

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_TREZOR_MOCK: {
      return new EthereumTrezorDeviceMock()
    }
    case WALLET_TYPE_TREZOR: {
      return new EthereumTrezorDeviceMock()
    }
    case WALLET_TYPE_LEDGER_MOCK: {
      return new EthereumLedgerDeviceMock()
    }
    case WALLET_TYPE_LEDGER: {
      return new EthereumLedgerDeviceMock()
    }
    case WALLET_TYPE_MEMORY: {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}

// TODO: Why all these selectors are placed here? WTF.
export const getNetwork = (state) => {
  return state.get(DUCK_NODES)
}

export const getSelectedNetworkId = (state) => {
  const nodes = getNetwork(state)
  return nodes.selected.networkId
}

export const getSelectedNetwork = (blockchain) => createSelector(
  getNetwork,
  (network) => {
    // if (!network || !network.selectedNetworkId || !network.networks) {
    //   return null
    // }

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
