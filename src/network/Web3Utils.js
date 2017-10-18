import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import ProviderEngine from 'web3-provider-engine'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'
import Web3 from 'web3'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'

export default class Web3Utils {
  static createEngine(wallet, providerUrl) {
    const engine = new ProviderEngine()

    const httpProvider = new Web3.providers.HttpProvider(providerUrl)

    engine.addProvider(new FilterSubprovider())
    engine.addProvider(new WalletSubprovider(wallet, {}))
    engine.addProvider(new Web3Subprovider(httpProvider))
    engine.start()

    return engine
  }

  static createStatusEngine(providerUrl) {
    const engine = new ProviderEngine()

    const httpProvider = new Web3.providers.HttpProvider(providerUrl)
    engine.addProvider(new Web3Subprovider(httpProvider))
    engine.start()

    return engine
  }
}
