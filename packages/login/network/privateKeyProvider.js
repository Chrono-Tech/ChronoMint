/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import nemSdk from 'nem-sdk'
import bigi from 'bigi'
import wallet from 'ethereumjs-wallet'
import hdKey from 'ethereumjs-wallet/hdkey'
import { byEthereumNetwork } from './NetworkProvider'
import { createBCCEngine, createBTCEngine, createLTCEngine, createBTGEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'

const COIN_TYPE_ETH = 60
const COIN_TYPE_BTC_MAINNET = 0
const COIN_TYPE_BTC_TESTNET = 1
const COIN_TYPE_LTC_MAINNET = 9
const COIN_TYPE_LTC_TESTNET = 8
const COIN_TYPE_BTG_MAINNET = 17
const COIN_TYPE_BTG_TESTNET = 16

class PrivateKeyProvider {
  getPrivateKeyProvider (privateKey, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(privateKey)

    const bitcoinLikeEngines = Object.create(null) // Object.create(null) creating really empty object with no __proto__
    bitcoinLikeEngines.bcc = false // Bitcoin Cache
    bitcoinLikeEngines.btc = false // Bitcoin
    bitcoinLikeEngines.btg = false // Bitcoin Gold
    bitcoinLikeEngines.ltc = false // Litecoin
    bitcoinLikeEngines.nem = false // Nem

    if (network) {

      // This method may be used only inside getMnemonicProvider, becuse of 'mnemonic' and 'bitcoin' in scope
      const prepareEngine = (net, creteWallet, createEngine) => {
	console.log('net is ' + net)      
        if (network) {
          const wallet = creteWallet(privateKey, net)
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
//      bitcoinLikeEngines.nem = prepareEngine(nemNetwork, NemWallet.fromMnemonic, createNEMEngine)

    }

    return {
      networkCode,
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      ...bitcoinLikeEngines,
    }
	
  }

  createBitcoinWallet (privateKey, network) {
    const coinType = network === bitcoin.networks.testnet
      ? COIN_TYPE_BTC_TESTNET
      : COIN_TYPE_BTC_MAINNET
    console.log(network)
    return bitcoin.HDNode.fromBase58(privateKey)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createLitecoinWallet (privateKey, network) {
    const coinType = network === bitcoin.networks.litecoin_testnet
      ? COIN_TYPE_LTC_TESTNET
      : COIN_TYPE_LTC_MAINNET
    return bitcoin.HDNode
      .fromBase58(privateKey)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createBitcoinGoldWallet (privateKey, network) {
    const coinType = network === bitcoin.networks.bitcoingold_testnet
      ? COIN_TYPE_BTG_TESTNET
      : COIN_TYPE_BTG_MAINNET
    return bitcoin.HDNode
      .fromBase58(privateKey)
      .derivePath(`m/44'/${coinType}'/0'/0/0`)
  }

  createEthereumWallet (privateKey) {
    const hdWallet = hdKey.fromExtendedKey(privateKey)
    // get the first account using the standard hd path
    const walletHDPath = `m/44'/${COIN_TYPE_ETH}'/0'/0`
    return hdWallet.derivePath(walletHDPath).getWallet()
    //return wallet.fromExtendedPrivateKey(privateKey.toString('hex'))
  }

  validatePrivateKey (privateKey: string): boolean {
    try {
      // not used now

      // if (/^xprv/.test(privateKey)) {
      // @see https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
      // wallet.fromExtendedPrivateKey(privateKey)
      // } else {

      // dry test
      wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      // }
      return true
    } catch (e) {
      return false
    }
  }
}

export default new PrivateKeyProvider()
