/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import hdKey from 'ethereumjs-wallet/hdkey'
import nemSdk from 'nem-sdk'

import {
  createBCCEngine,
  createBTCEngine,
  createBTGEngine,
  createLTCEngine,
} from './BitcoinUtils'
import { byEthereumNetwork } from './NetworkProvider'
import { createNEMEngine } from './NemUtils'
import EthereumEngine from './EthereumEngine'
import NemWallet from './NemWallet'

// coin_types 8, 9, 16, 17 used, but they are not standardized
const COIN_TYPE_ETH = 60
const COIN_TYPE_BTC_MAINNET = 0
const COIN_TYPE_BTC_TESTNET = 1
const COIN_TYPE_LTC_MAINNET = 9
const COIN_TYPE_LTC_TESTNET = 8
const COIN_TYPE_BTG_MAINNET = 17
const COIN_TYPE_BTG_TESTNET = 16

class MnemonicProvider {
  getMnemonicProvider (mnemonic, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(mnemonic)

    const bitcoinLikeEngines = Object.create(null) // Object.create(null) creating really empty object with no __proto__
    bitcoinLikeEngines.bcc = false // Bitcoin Cache
    bitcoinLikeEngines.btc = false // Bitcoin
    bitcoinLikeEngines.btg = false // Bitcoin Gold
    bitcoinLikeEngines.ltc = false // Litecoin
    bitcoinLikeEngines.nem = false // Nem

    if (network) {

      // This method may be used only inside getMnemonicProvider, becuse of 'mnemonic' and 'bitcoin' in scope
      const prepareEngine = (net, creteWallet, createEngine) => {
        if (network) {
          console.log('net is ' + net)
          const wallet = creteWallet(mnemonic, net)
          return createEngine(wallet, net)
        }
      }

      const btcNetwork = network.bitcoin && bitcoin.networks[network.bitcoin]
      const bccNetwork = network.bitcoinCash && bitcoin.networks[network.bitcoinCash]
      const btgNetwork = network.bitcoinGold && bitcoin.networks[network.bitcoinGold]
      const ltcNetwork = network.litecoin && bitcoin.networks[network.litecoin]
      const nemNetwork = network.nem && nemSdk.model.network.data[network.nem]

      bitcoinLikeEngines.bcc = prepareEngine(bccNetwork, this.createBitcoinWallet, createBCCEngine)
      bitcoinLikeEngines.btc = prepareEngine(btcNetwork, this.createBitcoinWallet, createBTCEngine)
      bitcoinLikeEngines.btg = prepareEngine(btgNetwork, this.createBitcoinGoldWallet, createBTGEngine)
      bitcoinLikeEngines.ltc = prepareEngine(ltcNetwork, this.createLitecoinWallet, createLTCEngine)
      bitcoinLikeEngines.nem = prepareEngine(nemNetwork, NemWallet.fromMnemonic, createNEMEngine)

    }

    return {
      networkCode,
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      ...bitcoinLikeEngines,
    }
  }

  createEthereumWallet (mnemonic, nonce = 0) {
    const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    // get the first account using the standard hd path
    console.log(hdWallet.privateExtendedKey())
    const walletHDPath = `m/44'/${COIN_TYPE_ETH}'/0'/0`
    return hdWallet.derivePath(walletHDPath).getWallet()
  }

  createBitcoinWallet (mnemonic, network) {
    const coinType = network === bitcoin.networks.testnet
      ? COIN_TYPE_BTC_TESTNET
      : COIN_TYPE_BTC_MAINNET
    return bitcoin.HDNode
      .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), bitcoin.networks.mainnet)
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
