/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdkey from 'ethereumjs-wallet/hdkey'
import ProviderEngine from 'web3-provider-engine'
import FilterSubprovider from 'web3-provider-engine/subproviders/filters'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import WalletSubprovider from './WalletSubprovider'
import { WALLET_HD_PATH } from './mnemonicProvider'

ProviderEngine.prototype.changeProvider = function (source, idx) {
  const self = this
  self._providers[idx] = source
  source.setEngine(this)
}

export default class HDWalletProvider {
  constructor (wallet, provider_url, address_index = 0, num_addresses = 0) {
    this.hdwallet = hdkey.fromMasterSeed(wallet.getPrivateKey())
    this.wallet_hdpath = WALLET_HD_PATH
    this.wallets = [wallet]
    this.addresses = {}

    for (let i = 0; i <= num_addresses; i++) {
      this.getAddress(i + address_index)
    }
    this.addresses[num_addresses] = wallet.getAddressString()

    this.engine = new ProviderEngine()
    this.engine.addProvider(new WalletSubprovider(this.wallets, {}))
    this.engine.addProvider(new FilterSubprovider({ maxFilters: 0 }))
    this.engine.addProvider(new RpcSubprovider({ rpcUrl: provider_url }))
    this.engine.start() // Required by the provider engine.
  }

  sendAsync () {
    this.engine.sendAsync.apply(this.engine, arguments)
  }

  send () {
    return this.engine.send.apply(this.engine, arguments)
  }

  // returns the address of the given address_index, first checking the cache
  getAddress (idx) {
    if (!(idx in Object.keys(this.addresses))) {
      let wallet = this.hdwallet.derivePath(`${this.wallet_hdpath}/${idx}`).getWallet()
      this.wallets.push(wallet)
      this.addresses[idx] = wallet.getAddressString()
    }
    return this.addresses[idx]
  }

  pushWallet (idx) {
    let wallet = this.hdwallet.derivePath(`${this.wallet_hdpath}/${idx}`).getWallet()
    this.wallets.push(wallet)
    this.addresses[Object.values(this.addresses).length] = wallet.getAddressString()
    this.engine.changeProvider(new WalletSubprovider(this.wallets, {}), 0)
  }

  // returns the addresses cache
  getAddresses () {
    return Object.values(this.addresses)
  }
}
