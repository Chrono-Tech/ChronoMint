import wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'
import bitcoin from 'bitcoinjs-lib'

window.wallet = wallet
window.Buffer = Buffer

export const createEthereumWallet = (privateKey) => {
  return wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
}

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

const privateKeyProvider = (privateKey, { url, network }) => {
  const ethereum = createEthereumWallet(privateKey)
  const btc = bitcoin.HDNode.fromSeedBuffer(ethereum.privKey, bitcoin.networks[network.bitcoin])
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    bitcoin: BitcoinUtils.createEngine(btc, bitcoin.networks[network.bitcoin]),
  }
}

export default privateKeyProvider
