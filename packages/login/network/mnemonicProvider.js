import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import nemSdk from 'nem-sdk'
import hdKey from 'ethereumjs-wallet/hdkey'
import { byEthereumNetwork } from './NetworkProvider'
import { createBCCEngine, createBTCEngine, createLTCEngine, createBTGEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'

import { createNEMEngine } from './NemUtils'
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
    const btc = network && network.bitcoin && this.createBitcoinWallet(mnemonic, bitcoin.networks[network.bitcoin])
    const bcc = network && network.bitcoinCash && this.createBitcoinWallet(mnemonic, bitcoin.networks[network.bitcoinCash])
    const btg = network && network.bitcoinGold && this.createBitcoinGoldWallet(mnemonic, bitcoin.networks[network.bitcoinGold])
    const ltc = network && network.litecoin && this.createLitecoinWallet(mnemonic, bitcoin.networks[network.litecoin])
    const nem = network && network.nem && NemWallet.fromMnemonic(mnemonic, nemSdk.model.network.data[network.nem])

    return {
      networkCode,
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
      bcc: network && network.bitcoinCash && createBCCEngine(bcc, bitcoin.networks[network.bitcoinCash]),
      btg: network && network.bitcoinGold && createBTGEngine(btg, bitcoin.networks[network.bitcoinGold]),
      ltc: network && network.litecoin && createLTCEngine(ltc, bitcoin.networks[network.litecoin]),
      nem: network && network.nem && createNEMEngine(nem, nemSdk.model.network.data[network.nem]),
    }
  }

  createEthereumWallet (mnemonic, nonce = 0) {
    const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
    // get the first account using the standard hd path
    const walletHDPath = `m/44'/${COIN_TYPE_ETH}'/0'/0/${nonce}`
    return hdWallet.derivePath(walletHDPath).getWallet()
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
