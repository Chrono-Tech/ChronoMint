/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import * as WavesApi from '@waves/waves-api'
import nemSdk from 'nem-sdk'
import { byEthereumNetwork } from './NetworkProvider'
import { createBCCEngine, createBTCEngine, createLTCEngine, createBTGEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import { createNEMEngine } from './NemUtils'
import { createWAVESEngine } from './WavesUtils'
import NemWallet from './NemWallet'
import WavesWallet from './WavesWallet'
import EthereumWallet from './EthereumWallet'

class WalletProvider {
  getProvider (walletJson, password, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = EthereumWallet.fromFile(walletJson, password, true)
    const engine = new EthereumEngine(ethereumWallet, network, url)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[network.bitcoin])
    const bcc = network && network.bitcoinCash && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[network.bitcoinCash])
    const btg = network && network.bitcoinGold && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[network.bitcoinGold])
    const ltc = network && network.litecoin && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[network.litecoin])
    const nem = network && network.nem && NemWallet.fromPrivateKey(ethereumWallet.privKey.toString('hex'), nemSdk.model.network.data[network.nem])
    const waves = network && network.waves && WavesWallet.fromPrivateKey(ethereumWallet.privKey.toString('hex'), WavesApi[network.waves])

    return {
      networkCode,
      ethereum: engine, //new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
      bcc: network && network.bitcoinCash && createBCCEngine(bcc, bitcoin.networks[network.bitcoinCash]),
      btg: network && network.bitcoinGold && createBTGEngine(btg, bitcoin.networks[network.bitcoinGold]),
      ltc: network && network.litecoin && createLTCEngine(ltc, bitcoin.networks[network.litecoin]),
      nem: network && network.nem && createNEMEngine(nem, nemSdk.model.network.data[network.nem]),
      waves: network && network.waves && createWAVESEngine(waves, WavesApi[network.waves]),
    }
  }
}

export default new WalletProvider()
