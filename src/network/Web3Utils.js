import ProviderEngine from 'web3-provider-engine'
import WalletSubprovider from 'web3-provider-engine/subproviders/wallet'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import Web3 from 'web3'

export default class Web3Utils {

  static createEngine (wallet, providerUrl) {

    const engine = new ProviderEngine()

    engine.addProvider(new FilterSubprovider())
    engine.addProvider(new WalletSubprovider(wallet, {}))
    engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(providerUrl)))

    engine.start()

    return engine
  }
}
