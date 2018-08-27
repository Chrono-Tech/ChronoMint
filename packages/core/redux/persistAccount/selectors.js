/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from './constants'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import TrezorDevice from '../../services/signers/TrezorDevice'
import TrezorDeviceMock from '../../services/signers/TrezorDeviceMock'
import LedgerDevice from '../../services/signers/LedgerDevice'
import LedgerDeviceMock from '../../services/signers/LedgerDeviceMock'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import NemMemoryDevice from '../../services/signers/NemMemoryDevice'

export const getPersistAccount = (state) => {
  return state.get(DUCK_PERSIST_ACCOUNT)
}

export const getSigner = (state) => {
  const account = getPersistAccount(state)
  console.log(account)
  switch (account.selectedWallet.encrypted[0].type) {
    case 'trezor_mock': {
      return new TrezorDeviceMock()
    }
    case 'ledger_mock': {
      return new LedgerDeviceMock()
    }
    case 'trezor': {
      return new TrezorDevice()
    }
    case 'ledger': {
      return new LedgerDevice()
    }
    case 'memory': {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}

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

export const getNemSigner = (state) => {
  const account = getPersistAccount(state)
  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case 'memory': {
      return new NemMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}

export const getSelectedNetwork = () => createSelector(
  (state) => state.get(DUCK_NETWORK),
  (network) => {
    if (!network.selectedNetworkId) {
      return null
    }

    return network.networks && network.networks.find(
      (item) => item.id === network.selectedNetworkId,
    )
  },
)
