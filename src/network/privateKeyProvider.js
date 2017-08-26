import wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'

window.wallet = wallet
window.Buffer = Buffer

export const createEthereumWallet = (privateKey) => {
  return wallet.fromPrivateKey(Buffer.from(privateKey, 'hex'))
}

// eslint-disable-next-line
export const createBitcoinWallet = (privateKey) => {
  return null
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

const privateKeyProvider = (privateKey, providerUrl) => {
  const ethereum = createEthereumWallet(privateKey)
  const bitcoin = createBitcoinWallet(privateKey)
  return {
    ethereum: Web3Utils.createEngine(ethereum, providerUrl),
    bitcoin: BitcoinUtils.createEngine(bitcoin, providerUrl),
  }
}

export default privateKeyProvider
