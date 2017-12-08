import bitcoin from 'bitcoinjs-lib'
import wallet from 'ethereumjs-wallet'
import { createBCCEngine, createBTCEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import * as NEM from './nem'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'

class PrivateKeyProvider {
  getPrivateKeyProvider (privateKey, { url, network } = {}) {
    const ethereumWallet = this.createEthereumWallet(privateKey)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[ network.bitcoin ])
    const bcc = btc
    const nem = network && network.nem && NemWallet.fromPrivateKey(privateKey, NEM.Network.data[network.nem])

    return {
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[ network.bitcoin ]),
      bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[ network.bitcoin ]),
      nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
    }
  }

  createEthereumWallet (privateKey) {
    return wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
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
