/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import bitcoin from 'bitcoinjs-lib'
import { DUCK_BITCOIN } from './constants'
import { getPersistAccount, getSelectedNetwork } from '../persistAccount/selectors'
import {
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_METAMASK,
} from '../../models/constants/AccountEntryModel'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_LITECOIN,
} from '../../dao/constants'
import MetamaskPlugin from '../../services/signers/MetamaskPlugin'
import BitcoinMemoryDevice from '../../services/signers/BitcoinMemoryDevice'
import BitcoinLedgerDeviceMock from '../../services/signers/BitcoinLedgerDeviceMock'
import BitcoinLedgerDevice from '../../services/signers/BitcoinLedgerDevice'
import BitcoinTrezorDeviceMock from '../../services/signers/BitcoinTrezorDeviceMock'
import BitcoinTrezorDevice from '../../services/signers/BitcoinTrezorDevice'

import BitcoinCashMemoryDevice from '../../services/signers/BitcoinCashMemoryDevice'
import BitcoinCashLedgerDeviceMock from '../../services/signers/BitcoinCashLedgerDeviceMock'
import BitcoinCashLedgerDevice from '../../services/signers/BitcoinCashLedgerDevice'
import BitcoinCashTrezorDeviceMock from '../../services/signers/BitcoinCashTrezorDeviceMock'
import BitcoinCashTrezorDevice from '../../services/signers/BitcoinCashTrezorDevice'

import LitecoinTrezorDevice from '../../services/signers/LitecoinTrezorDevice'

export const bitcoinSelector = () => (state) =>
  state.get(DUCK_BITCOIN)

export const bitcoinPendingSelector = (blockchain) => createSelector(
  bitcoinSelector(),
  (scope) => scope[blockchain].pending,
)

export const pendingEntrySelector = (address, key, blockchain) => createSelector(
  bitcoinPendingSelector(blockchain),
  (pending) => {
    if (address in pending) {
      return pending[address][key] || null
    }
    return null
  },
)

export const getBitcoinSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_BITCOIN]]
  const isTestnet = networkData[BLOCKCHAIN_BITCOIN] === 'testnet'

  switch (account.decryptedWallet.entry.encrypted[0].type) {
  case WALLET_TYPE_MEMORY: {
    const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
    return new BitcoinMemoryDevice({ privateKey, network })
  }
  case WALLET_TYPE_LEDGER: {
    if (process.env.DEVICE_MOCKS) {
      return new BitcoinLedgerDeviceMock({ network })
    }
    return new BitcoinLedgerDevice({ network })
  }
  case WALLET_TYPE_TREZOR: {
    if (process.env.DEVICE_MOCKS) {
      return new BitcoinTrezorDeviceMock({ network })
    }
    return new BitcoinTrezorDevice({ network, isTestnet })
  }
  case WALLET_TYPE_METAMASK: {
    return new MetamaskPlugin()
  }
  }
}

export const getBitcoinCashSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_BITCOIN_CASH]]
  const isTestnet = networkData[BLOCKCHAIN_BITCOIN_CASH] === 'testnet'

  switch (account.decryptedWallet.entry.encrypted[0].type) {
  case WALLET_TYPE_MEMORY: {
    const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
    return new BitcoinCashMemoryDevice({ privateKey, network })
  }
  case WALLET_TYPE_LEDGER: {
    if (process.env.DEVICE_MOCKS) {
      return new BitcoinCashLedgerDeviceMock({ network })
    }
    return new BitcoinCashLedgerDevice({ network })
  }
  case WALLET_TYPE_TREZOR: {
    if (process.env.DEVICE_MOCKS) {
      return new BitcoinCashTrezorDeviceMock({ network })
    }
    return new BitcoinCashTrezorDevice({ network, isTestnet })
  }
  case WALLET_TYPE_METAMASK: {
    return new MetamaskPlugin()
  }
  }
}

export const getLitecoinSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_LITECOIN]]
  const isTestnet = networkData[BLOCKCHAIN_LITECOIN] === 'litecoin_testnet'

  switch (account.decryptedWallet.entry.encrypted[0].type) {
  case WALLET_TYPE_MEMORY: {
    const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
    return new BitcoinMemoryDevice({ privateKey, network })
  }
  case WALLET_TYPE_LEDGER: {
    if (process.env.DEVICE_MOCKS) {
      return new BitcoinMemoryDevice({ network })
    }
    return new BitcoinMemoryDevice({ network })
  }
  case WALLET_TYPE_TREZOR: {
    if (process.env.DEVICE_MOCKS) {
      return new LitecoinTrezorDevice({ network })
    }
    return new LitecoinTrezorDevice({ network, isTestnet })
  }
  case WALLET_TYPE_METAMASK: {
    return new MetamaskPlugin()
  }
  }
}

export const getSignerModalComponentName = (state) => {
  const { selectedWallet } = getPersistAccount(state)
  switch (selectedWallet.encrypted[0].type) {
  // feel free to add your components here. We have only one component at the moment
  case WALLET_TYPE_TREZOR:
  case WALLET_TYPE_LEDGER: {
    return 'ActionRequestDeviceDialog'
  }
  default:
    return null
  }
}
