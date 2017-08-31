import wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'

export const createWallet = (privateKey) => {
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

const privateKeyProvider = (privateKey, providerUrl) => {
  const wallet = createWallet(privateKey)
  return Web3Utils.createEngine(wallet, providerUrl)
}

export default privateKeyProvider
