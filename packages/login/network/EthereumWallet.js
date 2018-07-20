/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Wallet from 'ethereumjs-wallet'
import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import { WALLET_HD_PATH } from './mnemonicProvider'

// TODO @abdulov remove console.log
console.log('Wallet', Wallet)
export default class EthereumWallet extends Wallet {
  static createWallet (params) {
    const { type, pk, mnemonic } = params
    this.type = type

    let hdWallet
    switch (true) {
      case type === 'memory' && pk && pk.length <= 64:
        // TODO @abdulov remove console.log
        console.log('createWallet', new EthereumWallet(pk, null, type))
        return new EthereumWallet(pk, null, type)
      case type === 'memory' && !!pk:
        hdWallet = hdKey.fromMasterSeed(Buffer.from(pk, 'hex'))
        this.wallet = hdWallet.derivePath(WALLET_HD_PATH).getWallet()
        break
      case type === 'memory' && !!mnemonic:
        hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
        this.wallet = hdWallet.derivePath(WALLET_HD_PATH).getWallet()
        break
    }
  }

  constructor (priv, pub, type) {
    super(priv, pub)
    this.type = type
  }
}
