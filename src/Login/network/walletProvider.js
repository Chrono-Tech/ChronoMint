import Wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'
import bitcoin from 'bitcoinjs-lib'

class WalletProvider {
  getProvider (walletJson, password, {url, network} = {}) {

    const ethereum = Wallet.fromV3(walletJson, password, true)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
    return {
      ethereum: Web3Utils.createEngine(ethereum, url),
      bitcoin: network && network.bitcoin && BitcoinUtils.createEngine(btc, bitcoin.networks[network.bitcoin])
    }
  }
}

export default new WalletProvider()
