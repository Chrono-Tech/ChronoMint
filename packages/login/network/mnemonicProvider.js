/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
// import hdKe y from 'ethereumjs-wallet/hdkey'
import * as WavesApi from '@waves/waves-api'
import nemSdk from 'nem-sdk'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
} from '@chronobank/login/network/constants'
import {
  createBCCEngine,
  createBTCEngine,
  createLTCEngine,
} from './BitcoinUtils'
import { byEthereumNetwork } from './NetworkProvider'
import { createNEMEngine } from './NemUtils'
import { createWAVESEngine } from './WavesUtils'
import EthereumEngine from './EthereumEngine'
import NemWallet from './NemWallet'
import WavesWallet from './WavesWallet'
import EthereumWallet from './EthereumWallet'

import {
  COIN_TYPE_BTC_MAINNET,
  COIN_TYPE_BTC_TESTNET,
  COIN_TYPE_LTC_MAINNET,
  COIN_TYPE_LTC_TESTNET,
} from './constants'

class MnemonicProvider {
  getMnemonicProvider (mnemonic, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(mnemonic)

    const Engines = Object.create(null) // Object.create(null) creating really empty object with no __proto__
    Engines.bcc = false // Bitcoin Cache
    Engines.btc = false // Bitcoin
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

      const btcNetwork = network[BLOCKCHAIN_BITCOIN]  && bitcoin.networks[network[BLOCKCHAIN_BITCOIN] ]
      const bccNetwork = network[BLOCKCHAIN_BITCOIN_CASH]  && bitcoin.networks[network[BLOCKCHAIN_BITCOIN_CASH] ]
      const ltcNetwork = network[BLOCKCHAIN_LITECOIN]  && bitcoin.networks[network[BLOCKCHAIN_LITECOIN] ]
      const nemNetwork = network[BLOCKCHAIN_NEM]  && nemSdk.model.network.data[network[BLOCKCHAIN_NEM] ]
      const wavesNetwork = network[BLOCKCHAIN_WAVES]  && WavesApi[network[BLOCKCHAIN_WAVES] ]

      Engines.bcc = prepareEngine(bccNetwork, this.createBitcoinWallet, createBCCEngine)
      Engines.btc = prepareEngine(btcNetwork, this.createBitcoinWallet, createBTCEngine)
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

  validateMnemonic (mnemonic) {
    return bip39.validateMnemonic(mnemonic)
  }

  generateMnemonic () {
    return bip39.generateMnemonic()
  }
}

export default new MnemonicProvider()
