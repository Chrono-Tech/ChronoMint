import Wallet from 'ethereumjs-wallet'
import bitcoin from 'bitcoinjs-lib'

import * as NEM from './nem'
import NemWallet from './NemWallet'

import { createBTCEngine, createBCCEngine } from './BitcoinUtils'
import { createNEMEngine } from './NemUtils'
import Web3Utils from './Web3Utils'

const walletProvider = (walletJson, password, { url, network } = {}) => {
  const ethereum = Wallet.fromV3(walletJson, password, true)
  const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
  const bcc = btc // the same
  const nem = network && network.nem && NemWallet.fromPrivateKey(ethereum.privKey.toString('hex'), NEM.Network.data[network.nem])
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
    bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[network.bitcoin]),
    nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
  }
}

export default walletProvider
