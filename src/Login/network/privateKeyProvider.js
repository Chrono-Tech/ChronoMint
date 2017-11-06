import bitcoin from 'bitcoinjs-lib'
import wallet from 'ethereumjs-wallet'

import { createBCCEngine, createBTCEngine } from './BitcoinUtils'
import Web3Utils from './Web3Utils'

class PrivateKeyProvider {
  getPrivateKeyProvider (privateKey, { url, network } = {}) {
    const ethereum = this.createEthereumWallet(privateKey)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[ network.bitcoin ])
    const bcc = btc

    return {
      ethereum: Web3Utils.createEngine(ethereum, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[ network.bitcoin ]),
      bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[ network.bitcoin ]),
    }
  }

  createEthereumWallet (privateKey) {
    return wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
  }

  validatePrivateKey (privateKey: string): boolean {
    try {
      wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
      return true
    } catch (e) {
      return false
    }
  }
}

export default new PrivateKeyProvider()
