/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import bitcoin from 'bitcoinjs-lib'
import nemSdk from 'nem-sdk'
import * as WavesApi from '@waves/waves-api'

import {
  WALLET_TYPE_LEDGER,
  WALLET_TYPE_LEDGER_MOCK,
  WALLET_TYPE_MEMORY,
  WALLET_TYPE_METAMASK,
  WALLET_TYPE_TREZOR,
  WALLET_TYPE_TREZOR_MOCK,
} from '../../models/constants/AccountEntryModel';
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '../../dao/constants';

import { getPersistAccount, getSelectedNetwork } from '../../redux/persistAccount/selectors'

import MetamaskPlugin from './MetamaskPlugin'

import BitcoinMemoryDevice from './BitcoinMemoryDevice'
import BitcoinLedgerDeviceMock from './BitcoinLedgerDeviceMock'
import BitcoinTrezorDeviceMock from './BitcoinTrezorDeviceMock'

import BitcoinCashMemoryDevice from './BitcoinCashMemoryDevice'
import BitcoinCashLedgerDeviceMock from './BitcoinCashLedgerDeviceMock'
import BitcoinCashTrezorDeviceMock from './BitcoinCashTrezorDeviceMock'

import DashMemoryDevice from './dash/MemoryDevice'

import EthereumTrezorDeviceMock from './EthereumTrezorDeviceMock'
import EthereumTrezorDevice from './EthereumTrezorDevice'
import EthereumLedgerDeviceMock from './EthereumLedgerDeviceMock'
import EthereumLedgerDevice from './EthereumLedgerDevice'
import EthereumMemoryDevice from './EthereumMemoryDevice'

import NemMemoryDevice from './NemMemoryDevice'
import NemTrezorDevice from './NemTrezorDevice'
import NemTrezorDeviceMock from './NemTrezorDeviceMock'

import WavesMemoryDevice from './WavesMemoryDevice'
import WavesLedgerDevice from './WavesLedgerDevice'
import WavesLedgerDeviceMock from './WavesLedgerDeviceMock'

export const getSigner = (blockchainType, state) => {
  switch (blockchainType) {
    case BLOCKCHAIN_BITCOIN: return getBitcoinSigner(state);
    case BLOCKCHAIN_BITCOIN_CASH: return getBitcoinCashSigner(state);
    case BLOCKCHAIN_DASH: return getDashSigner(state);
    case BLOCKCHAIN_LITECOIN: return getLitecoinSigner(state);
    case BLOCKCHAIN_ETHEREUM: return getEthereumSigner(state);
    case BLOCKCHAIN_NEM: return getNemSigner(state);
    case BLOCKCHAIN_WAVES: return getWavesSigner(state);
  }
};

export const getBitcoinSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_BITCOIN]]

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new BitcoinMemoryDevice({ privateKey, network })
    }
    case WALLET_TYPE_LEDGER_MOCK:
    case WALLET_TYPE_LEDGER: {
      return new BitcoinLedgerDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR_MOCK:
    case WALLET_TYPE_TREZOR: {
      return new BitcoinTrezorDeviceMock({ network })
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

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new BitcoinCashMemoryDevice({ privateKey, network })
    }
    case WALLET_TYPE_LEDGER_MOCK:
    case WALLET_TYPE_LEDGER: {
      return new BitcoinCashLedgerDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR_MOCK:
    case WALLET_TYPE_TREZOR: {
      return new BitcoinCashTrezorDeviceMock({ network })
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin()
    }
  }
}

export const getDashSigner = (state) => {
  const account = getPersistAccount(state);
  const networkData = getSelectedNetwork()(state);
  const network = bitcoin.networks[networkData[BLOCKCHAIN_DASH]];

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66);
      return new DashMemoryDevice({ privateKey, network });
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin();
    }
  }
};

export const getLitecoinSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = bitcoin.networks[networkData[BLOCKCHAIN_LITECOIN]]

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new BitcoinMemoryDevice({ privateKey, network })
    }
    case WALLET_TYPE_LEDGER_MOCK:
    case WALLET_TYPE_LEDGER: {
      return new BitcoinLedgerDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR_MOCK:
    case WALLET_TYPE_TREZOR: {
      return new BitcoinTrezorDeviceMock({ network })
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin()
    }
  }
}

export const getEthereumSigner = (state) => {
  const account = getPersistAccount(state)

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_MEMORY: return new EthereumMemoryDevice(account.decryptedWallet.privateKey)
    case WALLET_TYPE_LEDGER: return new EthereumLedgerDevice()
    case WALLET_TYPE_LEDGER_MOCK: return new EthereumLedgerDeviceMock()
    case WALLET_TYPE_TREZOR: return new EthereumTrezorDevice()
    case WALLET_TYPE_TREZOR_MOCK: return new EthereumTrezorDeviceMock()
  }
}

export const getNemSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = nemSdk.model.network.data[networkData[BLOCKCHAIN_NEM] ]

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new NemMemoryDevice({ privateKey, network })
    }
    case WALLET_TYPE_TREZOR_MOCK: {
      return new NemTrezorDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR: {
      return new NemTrezorDevice({ network })
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin()
    }
  }
};

export const getWavesSigner = (state) => {
  const account = getPersistAccount(state)
  const networkData = getSelectedNetwork()(state)
  const network = WavesApi[networkData[BLOCKCHAIN_WAVES]]

  switch (account.decryptedWallet.entry.encrypted[0].type) {
    case WALLET_TYPE_MEMORY: {
      const privateKey = account.decryptedWallet.privateKey.slice(2, 66)
      return new WavesMemoryDevice({ seedPhrase: privateKey, network })
    }
    case WALLET_TYPE_TREZOR_MOCK: {
      return new WavesLedgerDeviceMock({ network })
    }
    case WALLET_TYPE_TREZOR: {
      return new WavesLedgerDevice({ network })
    }
    case WALLET_TYPE_METAMASK: {
      return new MetamaskPlugin()
    }
  }
};