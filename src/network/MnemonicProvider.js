import hdkey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import Web3Utils from './Web3Utils'

const createWallet = (mnemonic) => {
  const hdwallet = hdkey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  // Get the first account using the standard hd path.
  const walletHDPath = 'm/44\'/60\'/0\'/0/'
  return hdwallet.derivePath(walletHDPath + '0').getWallet()
}

const mnemonicProvider = (mnemonic, providerUrl) => {
  const wallet = createWallet(mnemonic)
  return Web3Utils.createEngine(wallet, providerUrl)
}

export default mnemonicProvider
