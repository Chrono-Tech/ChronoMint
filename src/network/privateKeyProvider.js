import bitcoin from 'bitcoinjs-lib'
import wallet from 'ethereumjs-wallet'
import * as NEM from './nem'
import NemWallet from './NemWallet'

import { createBTCEngine, createBCCEngine } from './BitcoinUtils'
import { createNEMEngine } from './NemUtils'
import Web3Utils from './Web3Utils'

export const createEthereumWallet = privateKey => wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))

export const validatePrivateKey = (privateKey: string): boolean => {
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

const privateKeyProvider = (privateKey, { url, network } = {}) => {
  const ethereum = createEthereumWallet(privateKey)
  const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
  const bcc = btc // the same
  const nem = network && network.nem && NemWallet.fromPrivateKey(privateKey, NEM.Network.data[network.nem])
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
    bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[network.bitcoin]),
    nem: network && network.nem && createNEMEngine(nem, NEM.Network.data[network.nem]),
  }
}

export default privateKeyProvider
