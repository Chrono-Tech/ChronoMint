import bitcoin from 'bitcoinjs-lib'
import Wallet from 'ethereumjs-wallet'
import * as NEM from './nem'
import { createBCCEngine, createBTCEngine } from './BitcoinUtils'
import { createNEMEngine } from './NemUtils'
import NemWallet from './NemWallet'
import Web3Utils from './Web3Utils'

class WalletProvider {
  getProvider (walletJson, password, { url, network } = {}) {

    const ethereum = Wallet.fromV3(walletJson, password, true)
    const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[ network.bitcoin ])
    const bcc = btc
    const nem = network && network.nem && NemWallet.fromPrivateKey(ethereum.privKey.toString('hex'), NEM.Network.data[network.nem])

    return {
      ethereum: Web3Utils.createEngine(ethereum, url),
      btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[ network.bitcoin ]),
      bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[ network.bitcoin ]),
      nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
    }
  }
}

export default new WalletProvider()
