import bitcoin from 'bitcoinjs-lib'
import Wallet from 'ethereumjs-wallet'
import { createBCCEngine, createBTCEngine } from './BitcoinUtils'
import EthereumEngine from './EthereumEngine'
import * as NEM from './nem'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'

class WalletProvider {
  getProvider (walletJson, password, { url, network } = {}) {

    const ethereumWallet = Wallet.fromV3(walletJson, password, true)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereumWallet.privKey, bitcoin.networks[ network.bitcoin ])
    const bcc = btc
    const nem = network && network.nem && NemWallet.fromPrivateKey(ethereumWallet.privKey.toString('hex'), NEM.Network.data[network.nem])

    return {
      ethereum: new EthereumEngine(ethereumWallet, network, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[ network.bitcoin ]),
      bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[ network.bitcoin ]),
      nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
    }
  }
}

export default new WalletProvider()
