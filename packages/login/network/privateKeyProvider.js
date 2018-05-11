/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import bitcoin from 'bitcoinjs-lib'
import nemSdk from 'nem-sdk'

import bigi from 'bigi'
import hdKey from 'ethereumjs-wallet/hdkey'
import bs58 from 'bs58'
import bitcore from 'bitcore-lib'
import EthereumBip44 from 'ethereum-bip44'
import wallet from 'ethereumjs-wallet'
import { byEthereumNetwork } from './NetworkProvider'
import { createBCCEngine, createBTCEngine, createLTCEngine, createBTGEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'

class PrivateKeyProvider {
  getPrivateKeyProvider (privateKey, { url, network } = {}) {
    const networkCode = byEthereumNetwork(network)
    const ethereumWallet = this.createEthereumWallet(privateKey)
    const btc = network && network.bitcoin && this.createBitcoinWallet(privateKey, bitcoin.networks[ network.bitcoin ])
    const bcc = network && network.bitcoinCash && this.createBitcoinWallet(privateKey, bitcoin.networks[ network.bitcoinCash ])
    const btg = network && network.bitcoinGold && this.createBitcoinWallet(privateKey, bitcoin.networks[ network.bitcoinGold ])
    const ltc = network && network.litecoin && this.createBitcoinWallet(privateKey, bitcoin.networks[ network.litecoin ])
    const nem = network && network.nem && NemWallet.fromPrivateKey(privateKey, nemSdk.model.network.data[ network.nem ])

    // eslint-disable-next-line
    console.log('getPrivateKeyProvider', ethereumWallet)
    const hdWallet = hdKey.fromMasterSeed(Buffer.from(privateKey, 'hex'))
    console.log('getPrivateKeyProvider', hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet().getAddressString())
    console.log('getPrivateKeyProvider', hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet().getAddressString())

    return {
      networkCode,
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[ network.bitcoin ]),
      bcc: network && network.bitcoinCash && createBCCEngine(bcc, bitcoin.networks[ network.bitcoinCash ]),
      btg: network && network.bitcoinGold && createBTGEngine(btg, bitcoin.networks[ network.bitcoinGold ]),
      ltc: network && network.litecoin && createLTCEngine(ltc, bitcoin.networks[ network.litecoin ]),
      nem: network && network.nem && createNEMEngine(nem, nemSdk.model.network.data[ network.nem ]),
    }
  }

  createBitcoinWallet (privateKey, network) {
    const keyPair = new bitcoin.ECPair(bigi.fromBuffer(Buffer.from(privateKey, 'hex')), null, {
      network,
    })
    return {
      keyPair,
      getNetwork () {
        return keyPair.getNetwork()
      },
      getAddress () {
        return keyPair.getAddress()
      },
    }
  }

  createEthereumWallet (privateKey) {
    // return wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
    const hdWallet = hdKey.fromMasterSeed(Buffer.from(privateKey, 'hex'))
    // eslint-disable-next-line
    console.log('createEthereumWallet', hdWallet.derivePath(`m/44'/60'/0'/0/0`).getWallet().getAddressString())
    console.log('createEthereumWallet', hdWallet.derivePath(`m/44'/60'/0'/0/1`).getWallet().getAddressString())

    // get the first account using the standard hd path
    const walletHDPath = `m/44'/60'/0'/0/0`

    return hdWallet.derivePath(walletHDPath).getWallet()
  }

  validatePrivateKey (privateKey: string): boolean {
    try {
      // not used now

      // if (/^xprv/.test(privateKey)) {
      // @see https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki
      // wallet.fromExtendedPrivateKey(privateKey)
      // } else {

      // dry test
      // wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      // }
      return true
    } catch (e) {
      return false
    }
  }
}

export default new PrivateKeyProvider()
