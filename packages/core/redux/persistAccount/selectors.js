/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import {
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_LEDGER_MOCK,
} from '@chronobank/core/models/constants/AccountEntryModel'
import { DUCK_PERSIST_ACCOUNT } from './constants'

import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import EthereumTrezorDeviceMock from '../../services/signers/EthereumTrezorDeviceMock'
import EthereumTrezorDevice from '../../services/signers/EthereumTrezorDevice'
import EthereumLedgerDeviceMock from '../../services/signers/EthereumLedgerDeviceMock'
import EthereumLedgerDevice from '../../services/signers/EthereumLedgerDevice'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorDeviceMock'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getEthereumSigner = (state) => {
  const account = getPersistAccount(state)
  console.log('getEthereumSigner: ', account)

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_TREZOR_MOCK: {
      return new EthereumTrezorDeviceMock()
    }
    case WALLET_TYPE_LEDGER_MOCK: {
      return new EthereumLedgerDeviceMock()
    }
    case WALLET_TYPE_TREZOR: {
      return new EthereumTrezorDevice()
    }
    case WALLET_TYPE_LEDGER: {
      return new EthereumLedgerDevice()
    }
    case WALLET_TYPE_MEMORY: {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
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
  console.log('getBtcSigner: ', account, )
  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_TREZOR_MOCK: {
      return new BitcoinTrezorDeviceMock()
    }
    case WALLET_TYPE_MEMORY: {
      return new BitcoinMemoryDevice(account.decryptedWallet.privateKey)
    }
    default:
      //eslint-disable-next-line
      console.warn('Unknown wallet type')
  }
}
