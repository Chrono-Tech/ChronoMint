/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import hdkey from 'ethereumjs-wallet/hdkey'
import { WALLET_HD_PATH } from './constants'

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

  }

  // returns the address of the given address_index, first checking the cache
  getAddress (idx) {
    if (!(idx in Object.keys(this.addresses))) {
      const wallet = this.hdwallet.derivePath(`${this.wallet_hdpath}/${idx}`).getWallet()
      this.wallets.push(wallet)
      this.addresses[idx] = wallet.getAddressString()
    }
    return this.addresses[idx]
  }

  pushWallet (idx) {
    const wallet = this.hdwallet.derivePath(`${this.wallet_hdpath}/${idx}`).getWallet()
    this.wallets.push(wallet)
    this.addresses[Object.values(this.addresses).length] = wallet.getAddressString()
  }

  // returns the addresses cache
  getAddresses () {
    return Object.values(this.addresses)
  }
}
