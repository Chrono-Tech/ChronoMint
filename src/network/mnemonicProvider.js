import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import bitcoin from 'bitcoinjs-lib'
import Web3Utils from './Web3Utils'
import BitcoinUtils from './BitcoinUtils'

export const createEthereumWallet = (mnemonic) => {
  const hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
  // get the first account using the standard hd path
  const walletHDPath = `m/44'/60'/0'/0/0`
  return hdWallet.derivePath(walletHDPath).getWallet()
}

export const createBitcoinWallet = (mnemonic, network) => {
  return bitcoin.HDNode
    .fromSeedBuffer(bip39.mnemonicToSeed(mnemonic), network)
    .derivePath(`m/44'/${network === bitcoin.networks.testnet ? 1 : 0}'/0'/0/0`)
}

export const validateMnemonic = (mnemonic) => {
  return bip39.validateMnemonic(mnemonic)
}

export const generateMnemonic = () => {
  return bip39.generateMnemonic()
}

const mnemonicProvider = (mnemonic, { url, network } = {}) => {
  const ethereum = createEthereumWallet(mnemonic)
  const btc = network && network.bitcoin && createBitcoinWallet(mnemonic, bitcoin.networks[network.bitcoin])
  return {
    ethereum: Web3Utils.createEngine(ethereum, url),
    bitcoin: network && network.bitcoin && BitcoinUtils.createEngine(btc, bitcoin.networks[network.bitcoin])
  }
}

export default mnemonicProvider
