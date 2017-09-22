import wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'
import bitcoin from 'bitcoinjs-lib'

class PrivateKeyProvider {
  getPrivateKeyProvider (privateKey, {url, network} = {}) {
    const ethereum = this.createEthereumWallet(privateKey)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
    return {
      ethereum: Web3Utils.createEngine(ethereum, url),
      bitcoin: network && network.bitcoin && BitcoinUtils.createEngine(btc, bitcoin.networks[network.bitcoin]),
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
