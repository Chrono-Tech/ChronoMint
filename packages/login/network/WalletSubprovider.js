/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import HookedWalletEthTxSubprovider from 'web3-provider-engine/subproviders/hooked-wallet-ethtx'

export default class WalletSubprovider extends HookedWalletEthTxSubprovider {
  constructor (wallets, opts) {
    let addresses
    if (Array.isArray(wallets)) {
      addresses = wallets.map((wallet) => wallet.getAddressString())
    } else {
      addresses = [wallets.getAddressString()]
    }
    opts.getAccounts = function (cb) {
      cb(null, addresses)
    }

    opts.getPrivateKey = function (address, cb) {
      let wallet = wallets[addresses.indexOf(address)]
      if (wallet) {
        cb(null, wallet.getPrivateKey())
      } else {
        return cb('Account not found')
      }
    }
    super(opts)
  }
}
