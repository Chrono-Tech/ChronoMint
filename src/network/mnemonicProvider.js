import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'

import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'

export const createEthereumWallet = (mnemonic) => {
  const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  // get the first account using the standard hd path
  const walletHDPath = 'm/44\'/60\'/0\'/0/'
  return hdWallet.derivePath(walletHDPath + '0').getWallet()
}

export const createBitcoinWallet = (mnemonic, network) => {
  const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  const walletHDPath = `m/44'/${network || 1}'/0'/0/0`
  return hdWallet.derivePath(walletHDPath).getWallet()
}

export const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic)
}

export const generateMnemonic = () => {
  return bip39.generateMnemonic()
}

const mnemonicProvider = (mnemonic, providerUrl) => {
  const ethereum = createEthereumWallet(mnemonic)
  const bitcoin = createBitcoinWallet(mnemonic)
  return {
    ethereum: Web3Utils.createEngine(ethereum, providerUrl),
    bitcoin: BitcoinUtils.createEngine(bitcoin, null)
  }
}

export default mnemonicProvider
