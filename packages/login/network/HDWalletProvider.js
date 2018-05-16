/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdkey from 'ethereumjs-wallet/hdkey'
import ProviderEngine from 'web3-provider-engine'
import FiltersSubprovider from 'web3-provider-engine/subproviders/filters'
import Web3Subprovider from 'web3-provider-engine/subproviders/web3'
import Web3 from 'web3'
import WalletSubprovider from './wallet'
import { WALLET_HD_PATH } from './mnemonicProvider'

export default class HDWalletProvider {
  constructor (wallet, provider_url, address_index = 0, num_addresses = 1) {
    this.hdwallet = hdkey.fromMasterSeed(wallet.getPrivateKey())
    this.wallet_hdpath = WALLET_HD_PATH
    this.wallets = [wallet]
    this.addresses = {}

    for (let i = 0; i < num_addresses; i++) {
      this.getAddress(i + address_index)
    }
    this.addresses[num_addresses] = wallet.getAddressString()

    this.engine = new ProviderEngine()
    this.engine.addProvider(new WalletSubprovider(this.wallets, {}))
    this.engine.addProvider(new FiltersSubprovider())
    this.engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(provider_url)))
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
      // eslint-disable-next-line
      console.log('getAddress', `${this.wallet_hdpath}/${idx}`)
      let wallet = this.hdwallet.derivePath(`${this.wallet_hdpath}/${idx}`).getWallet()
      this.wallets.push(wallet)
      this.addresses[idx] = wallet.getAddressString()
    }
    return this.addresses[idx]
  }

  // returns the addresses cache
  getAddresses () {
    return Object.values(this.addresses)
  }
}
