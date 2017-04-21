import ProviderEngine from 'web3-provider-engine'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import Web3 from 'web3'

export default class Web3Utils {
  static createEngine (wallet) {
    const providerUrl = 'https://testnet.infura.io'
    // const providerUrl = 'https://ropsten.infura.io/fsA7swiOymZ3Dv409gRg'
    // const providerUrl = 'http://localhost:8545'

    const engine = new ProviderEngine()
    engine.addProvider(new WalletSubprovider(wallet, {}))
    engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)))
    engine.start() // Required by the provider engine.
    return engine
  }
}
