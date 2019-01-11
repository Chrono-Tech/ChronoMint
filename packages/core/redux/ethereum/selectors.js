/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'

import { DUCK_ETHEREUM } from './constants'
import {
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_TREZOR,
} from '../../models/constants/AccountEntryModel'
import { getPersistAccount } from '../persistAccount/selectors'
import EthereumMemoryDevice from '../../services/signers/EthereumMemoryDevice'
import EthereumLedgerDeviceMock from '../../services/signers/EthereumLedgerDeviceMock'
import EthereumLedgerDevice from '../../services/signers/EthereumLedgerDevice'
import EthereumTrezorDeviceMock from '../../services/signers/EthereumTrezorDeviceMock'
import EthereumTrezorDevice from '../../services/signers/EthereumTrezorDevice'

export const ethereumSelector = () => (state) => state.get(DUCK_ETHEREUM)

export const web3Selector = () => createSelector(
  ethereumSelector(),
  (ethereum) => {
    return ethereum == null // nil check
      ? null
      : ethereum.web3.value
  },
)

export const getEthereumSigner = (state) => {
  const account = getPersistAccount(state)

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_TREZOR: {
      if (process.env.DEVICE_MOCKS) {
        return new EthereumTrezorDeviceMock()
      }
      return new EthereumTrezorDevice()
    }
    case WALLET_TYPE_LEDGER: {
      if (process.env.DEVICE_MOCKS) {
        return new EthereumLedgerDeviceMock()
      }
      return new EthereumLedgerDevice()
    }
    case WALLET_TYPE_MEMORY: {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    }
  }
}
