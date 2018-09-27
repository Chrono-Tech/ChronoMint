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
import EthereumMemoryDevice from './EthereumMemoryDevice'

import NemMemoryDevice from './NemMemoryDevice'
import NemTrezorDevice from './NemTrezorDevice'
import NemTrezorDeviceMock from './NemTrezorDeviceMock'

import WavesMemoryDevice from './WavesMemoryDevice'
import WavesLedgerDevice from './WavesLedgerDevice'
import WavesLedgerDeviceMock from './WavesLedgerDeviceMock'

const getConfiguredSigner = (blockchainType, state, devices, networkList, privateKeyFieldName = 'privateKey') => {
  const account = getPersistAccount(state);
  const targetDevice = account.decryptedWallet.entry.encrypted[0].type;
  devices[WALLET_TYPE_METAMASK] = MetamaskPlugin;

  if(devices.hasOwnProperty(targetDevice)) {
    const networkData = getSelectedNetwork()(state);
    const network = networkList[networkData[blockchainType]];
    const deviceConfig = { network };

    if(targetDevice === WALLET_TYPE_MEMORY) {
      deviceConfig[privateKeyFieldName] = account.decryptedWallet.privateKey.slice(2, 66);
    }

    return targetDevice === WALLET_TYPE_METAMASK ? new MetamaskPlugin() : new devices[targetDevice](deviceConfig);
  }
};

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
  return getConfiguredSigner (BLOCKCHAIN_BITCOIN, state, {
    [WALLET_TYPE_MEMORY]: BitcoinMemoryDevice,
    [WALLET_TYPE_LEDGER]: BitcoinLedgerDeviceMock,
    [WALLET_TYPE_LEDGER_MOCK]: BitcoinLedgerDeviceMock,
    [WALLET_TYPE_TREZOR]: BitcoinTrezorDeviceMock,
    [WALLET_TYPE_TREZOR_MOCK]: BitcoinTrezorDeviceMock
  }, bitcoin.networks);
};

export const getBitcoinCashSigner = (state) => {
  return getConfiguredSigner (BLOCKCHAIN_BITCOIN_CASH, state, {
    [WALLET_TYPE_MEMORY]: BitcoinCashMemoryDevice,
    [WALLET_TYPE_LEDGER]: BitcoinCashLedgerDeviceMock,
    [WALLET_TYPE_LEDGER_MOCK]: BitcoinCashLedgerDeviceMock,
    [WALLET_TYPE_TREZOR]: BitcoinCashTrezorDeviceMock,
    [WALLET_TYPE_TREZOR_MOCK]: BitcoinCashTrezorDeviceMock
  }, bitcoin.networks);
};

export const getDashSigner = (state) => {
  return getConfiguredSigner (BLOCKCHAIN_DASH, state, {
    [WALLET_TYPE_MEMORY]: DashMemoryDevice
  }, bitcoin.networks);
};

export const getLitecoinSigner = (state) => {
  return getConfiguredSigner (BLOCKCHAIN_LITECOIN, state, {
    [WALLET_TYPE_MEMORY]: BitcoinMemoryDevice,
    [WALLET_TYPE_LEDGER]: BitcoinLedgerDeviceMock,
    [WALLET_TYPE_LEDGER_MOCK]: BitcoinLedgerDeviceMock,
    [WALLET_TYPE_TREZOR]: BitcoinTrezorDeviceMock,
    [WALLET_TYPE_TREZOR_MOCK]: BitcoinTrezorDeviceMock
  }, bitcoin.networks);
};

export const getEthereumSigner = (state) => {
  const account = getPersistAccount(state);

  switch (account.selectedWallet.type) {
    case WALLET_TYPE_MEMORY: {
      return new EthereumMemoryDevice(account.decryptedWallet.privateKey);
    }
    case WALLET_TYPE_LEDGER: {
      return new EthereumTrezorDeviceMock();
    }
    case WALLET_TYPE_LEDGER_MOCK: {
      return new EthereumLedgerDeviceMock();
    }
    case WALLET_TYPE_TREZOR: {
      return new EthereumTrezorDevice();
    }
    case WALLET_TYPE_TREZOR_MOCK: {
      return new EthereumTrezorDeviceMock();
    }
  }
};

export const getNemSigner = (state) => {
  return getConfiguredSigner (BLOCKCHAIN_NEM, state, {
    [WALLET_TYPE_MEMORY]: NemMemoryDevice,
    [WALLET_TYPE_TREZOR]: NemTrezorDevice,
    [WALLET_TYPE_TREZOR_MOCK]: NemTrezorDeviceMock
  }, nemSdk.model.network.data);
};

export const getWavesSigner = (state) => {
  return getConfiguredSigner (BLOCKCHAIN_WAVES, state, {
    [WALLET_TYPE_MEMORY]: WavesMemoryDevice,
    [WALLET_TYPE_LEDGER]: WavesLedgerDevice,
    [WALLET_TYPE_LEDGER_MOCK]: WavesLedgerDeviceMock
  }, WavesApi, 'seedPhrase');
};
