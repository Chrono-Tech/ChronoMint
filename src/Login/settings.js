import web3Provider, { Web3Provider } from 'network/Web3Provider'
import uportProvider from 'network/uportProvider'
import bitcoinProvider from 'network/BitcoinProvider'
import mnemonicProvider from 'network/mnemonicProvider'
import privateKeyProvider from 'network/privateKeyProvider'
import walletProvider from 'network/walletProvider'
import ledgerProvider from 'network/LedgerProvider'
import { validateMnemonic } from 'network/mnemonicProvider'
import { generateMnemonic } from 'network/mnemonicProvider'
import walletGenerator from 'network/walletGenerator'
import { getNetworkById, LOCAL_ID, providerMap } from 'network/settings'
import { fetchAccount, startLedgerSync, stopLedgerSync } from 'redux/ledger/actions'
import { validatePrivateKey } from 'network/privateKeyProvider'
import {
  NETWORK_STATUS_UNKNOWN, NETWORK_STATUS_OFFLINE, NETWORK_STATUS_ONLINE, SYNC_STATUS_SYNCING, SYNC_STATUS_SYNCED
} from 'network/MonitorService'
import MnemonicGenerateIcon from 'assets/img/mnemonic-key-color.svg'
import web3Utils from 'network/Web3Utils'
import { loginLedger } from 'redux/ledger/actions'
import colors from 'styles/themes/variables'
import LocaleDropDown from 'layouts/partials/LocaleDropDown'
import { login } from 'redux/session/actions'
import inverted from 'styles/themes/inversed'

import resultCodes from 'chronobank-smart-contracts/common/errors'
import ls from 'utils/LocalStorage'
import SessionStorage from 'utils/SessionStorage'
import web3Converter from 'utils/Web3Converter'
import { decodeMNIDaddress, UPortAddress } from 'network/uportProvider'
import metaMaskResolver from 'network/metaMaskResolver'
import { getNetworksByProvider } from 'network/settings'
import { infuraNetworkMap, infuraLocalNetwork } from 'network/settings'


export const providers = {
  web3Provider,
  Web3Provider,
  bitcoinProvider,
  mnemonicProvider,
  privateKeyProvider,
  walletProvider,
  ledgerProvider,
  uportProvider
}

export const constants = {
  providerMap,
  infuraNetworkMap,
  infuraLocalNetwork,
  LOCAL_ID,
  NETWORK_STATUS_UNKNOWN,
  NETWORK_STATUS_OFFLINE,
  NETWORK_STATUS_ONLINE,
  SYNC_STATUS_SYNCING,
  SYNC_STATUS_SYNCED,
  resultCodes,
  getNetworksByProvider
}

export const actions = {
  generateMnemonic,
  walletGenerator,
  getNetworkById,
  fetchAccount,
  startLedgerSync,
  stopLedgerSync,
  validateMnemonic,
  loginLedger,
  login,
}

export const assets = {
  MnemonicGenerateIcon,
}

export const utils = {
  web3Utils,
  validatePrivateKey,
  ls,
  SessionStorage,
  web3Converter,
  decodeMNIDaddress,
  metaMaskResolver,
}

export const styles = {
  colors,
  inverted
}

export const components = {
  LocaleDropDown
}
export const types = {UPortAddress}
