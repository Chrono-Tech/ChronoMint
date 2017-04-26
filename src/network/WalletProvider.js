import Wallet from 'ethereumjs-wallet'
import Web3Utils from './Web3Utils'

const walletProvider = (walletJson, password, providerUrl) => {
  return Web3Utils.createEngine(Wallet.fromV3(walletJson, password, true), providerUrl)
}

export default walletProvider
