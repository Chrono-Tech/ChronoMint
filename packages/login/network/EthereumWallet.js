/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ethUtil from 'ethereumjs-util'
import Wallet from 'ethereumjs-wallet'
import hdKey from 'ethereumjs-wallet/hdkey'
import bip39 from 'bip39'
import { WALLET_HD_PATH } from './mnemonicProvider'

export default class EthereumWallet extends Wallet {
  static createWallet (params) {
    const { type, pk, mnemonic } = params
    this.type = type

    let hdWallet
    let hdkey
    switch (true) {
      case type === 'memory' && pk && pk.length <= 64:
        return new EthereumWallet(Buffer.from(pk, 'hex'), null, type)
      case type === 'memory' && !!pk:
        hdWallet = hdKey.fromMasterSeed(Buffer.from(pk, 'hex'))
        hdkey = hdWallet.derivePath(WALLET_HD_PATH)._hdkey
        if (hdkey._privateKey) {
          return new EthereumWallet(hdkey._privateKey, null, type)
        } else {
          return EthereumWallet.fromPublicKey(hdkey._publicKey, true, type)
        }
      case type === 'memory' && !!mnemonic:
        hdWallet = hdKey.fromMasterSeed(bip39.mnemonicToSeed(mnemonic))
        hdkey = hdWallet.derivePath(WALLET_HD_PATH)._hdkey
        if (hdkey._privateKey) {
          return new EthereumWallet(hdkey._privateKey, null, type)
        } else {
          return EthereumWallet.fromPublicKey(hdkey._publicKey, true, type)
        }
    }
  }

  static fromPublicKey (pub, nonStrict, type) {
    if (nonStrict) {
      pub = ethUtil.importPublic(pub)
    }
    return new EthereumWallet(null, pub, type)
  }

  constructor (priv, pub, type) {
    super(priv, pub)
    this.type = type
  }
}
