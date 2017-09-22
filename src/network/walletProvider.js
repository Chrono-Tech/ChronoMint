import Wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import { createBTCEngine, createBCCEngine} from './BitcoinUtils'
import bitcoin from 'bitcoinjs-lib'

export const getPrivateKeyFromWallet = (walletJson, password) =>
  Wallet.fromV3(walletJson, password, true).getPrivateKeyString().slice(2)

const walletProvider = (walletJson, password, { url, network } = {}) => {

  const ethereum = Wallet.fromV3(walletJson, password, true)
  const btc = network && network.bitcoin && bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
  const bcc = btc // the same
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    btc: network && network.bitcoin && createBTCEngine(btc, bitcoin.networks[network.bitcoin]),
    bcc: network && network.bitcoin && createBCCEngine(bcc, bitcoin.networks[network.bitcoin]),
  }
}

export default walletProvider
