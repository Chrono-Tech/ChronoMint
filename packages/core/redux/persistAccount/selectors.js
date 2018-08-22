/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_NETWORK } from '@chronobank/login/redux/network/constants'
import { DUCK_PERSIST_ACCOUNT } from './constants'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice.js'
import TrezorDevice from '../../services/signers/TrezorDevice.js'
import TrezorDeviceMock from '../../services/signers/TrezorDeviceMock.js'
import LedgerDevice from '../../services/signers/LedgerDevice.js'
import LedgerDeviceMock from '../../services/signers/LedgerDeviceMock.js'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice.js'

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
