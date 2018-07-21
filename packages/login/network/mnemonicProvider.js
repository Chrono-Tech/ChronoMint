/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import hdKey from 'ethereumjs-wallet/hdkey'
import * as WavesApi from '@waves/waves-api'
import nemSdk from 'nem-sdk'

import {
  createBCCEngine,
  createBTCEngine,
  createBTGEngine,
  createLTCEngine,
} from './BitcoinUtils'
import { byEthereumNetwork } from './NetworkProvider'
import { createNEMEngine } from './NemUtils'
import { createWAVESEngine } from './WavesUtils'
import EthereumEngine from './EthereumEngine'
import NemWallet from './NemWallet'
import WavesWallet from './WavesWallet'
import EthereumWallet from './EthereumWallet'

// coin_types 8, 9, 16, 17 used, but they are not standardized
export const COIN_TYPE_ETH = 60
export const COIN_TYPE_BTC_MAINNET = 0
export const COIN_TYPE_BTC_TESTNET = 1
export const COIN_TYPE_LTC_MAINNET = 9
export const COIN_TYPE_LTC_TESTNET = 8
export const COIN_TYPE_BTG_MAINNET = 17
export const COIN_TYPE_BTG_TESTNET = 16
// get the first account using the standard hd path
export const WALLET_HD_PATH = `m/44'/${COIN_TYPE_ETH}'/0'/0/0`

class MnemonicProvider {
  getMnemonicProvider (mnemonic, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(mnemonic)

    const Engines = Object.create(null) // Object.create(null) creating really empty object with no __proto__
    Engines.bcc = false // Bitcoin Cache
    Engines.btc = false // Bitcoin
    Engines.btg = false // Bitcoin Gold
    Engines.ltc = false // Litecoin
    Engines.nem = false // Nem
    Engines.waves = false // Waves

    if (network) {

      // This method may be used only inside getMnemonicProvider, becuse of 'mnemonic' and 'bitcoin' in scope
      const prepareEngine = (net, createWallet, createEngine) => {
        if (network) {
          const wallet = createWallet(mnemonic, net)
          return createEngine(wallet, net)
        }
      }

      const btcNetwork = network.bitcoin && bitcoin.networks[network.bitcoin]
      const bccNetwork = network.bitcoinCash && bitcoin.networks[network.bitcoinCash]
      const btgNetwork = network.bitcoinGold && bitcoin.networks[network.bitcoinGold]
      const ltcNetwork = network.litecoin && bitcoin.networks[network.litecoin]
      const nemNetwork = network.nem && nemSdk.model.network.data[network.nem]
      const wavesNetwork = network.waves && WavesApi[network.waves]

      Engines.bcc = prepareEngine(bccNetwork, this.createBitcoinWallet, createBCCEngine)
      Engines.btc = prepareEngine(btcNetwork, this.createBitcoinWallet, createBTCEngine)
      Engines.btg = prepareEngine(btgNetwork, this.createBitcoinGoldWallet, createBTGEngine)
      Engines.ltc = prepareEngine(ltcNetwork, this.createLitecoinWallet, createLTCEngine)
      Engines.nem = prepareEngine(nemNetwork, NemWallet.fromMnemonic, createNEMEngine)
      Engines.waves = prepareEngine(wavesNetwork, WavesWallet.fromMnemonic, createWAVESEngine)

    }

    return {
      networkCode,
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      ...Engines,
    }
  }

  createEthereumWallet (mnemonic) {
    return EthereumWallet.createWallet({ type: 'memory', mnemonic })
  }

  createBitcoinWallet (mnemonic, network) {
    const coinType = network === bitcoin.networks.testnet
      ? COIN_TYPE_BTC_TESTNET
      : COIN_TYPE_BTC_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createLitecoinWallet (mnemonic, network) {
    const coinType = network === bitcoin.networks.litecoin_testnet
      ? COIN_TYPE_LTC_TESTNET
      : COIN_TYPE_LTC_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createBitcoinGoldWallet (mnemonic, network) {
    const coinType = network === bitcoin.networks.bitcoingold_testnet
      ? COIN_TYPE_BTG_TESTNET
      : COIN_TYPE_BTG_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  validateMnemonic (mnemonic) {
    return bip39.validateMnemonic(mnemonic)
  }

  generateMnemonic () {
    return bip39.generateMnemonic()
  }
}

export default new MnemonicProvider()
