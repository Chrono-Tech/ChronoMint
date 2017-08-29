import Wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'
import bitcoin from 'bitcoinjs-lib'

const walletProvider = (walletJson, password, { url, network }) => {

  const ethereum = Wallet.fromV3(walletJson, password, true)
  const btc = bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    bitcoin: BitcoinUtils.createEngine(btc, bitcoin.networks[network.bitcoin])
  }
}

export default walletProvider
