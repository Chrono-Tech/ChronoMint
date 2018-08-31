/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import EthereumWallet from './EthereumWallet'
import privateKeyProvider from './privateKeyProvider'

class WalletProvider {
  getProvider (walletJson, password, settings = {}) {
    const ethereumWallet = EthereumWallet.fromFile(walletJson, password, true)

    return privateKeyProvider.getPrivateKeyProvider(ethereumWallet.privKey.toString('hex'), settings)
  }
}

export default new WalletProvider()
