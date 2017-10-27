import Wallet from 'ethereumjs-wallet'
import bitcoin from 'bitcoinjs-lib'

import { createBCCEngine, createBTCEngine } from './BitcoinUtils'
import Web3Utils from './Web3Utils'

class WalletProvider {
  getProvider (walletJson, password, {url, network} = {}) {

    const ethereum = Wallet.fromV3(walletJson, password, true)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
    const bcc = btc

    return {
      ethereum: Web3Utils.createEngine(ethereum, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
      bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[network.bitcoin]),
    }
  }
}

export default new WalletProvider()
