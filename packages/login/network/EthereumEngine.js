/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Web3Utils from '@chronobank/login/network/Web3Utils'
import hdKey from 'ethereumjs-wallet/hdkey'
import { WALLET_HD_PATH } from './mnemonicProvider'

export default class EthereumEngine {
  constructor (wallet, network, url, engine) {
    this._wallet = wallet
    this._network = network
    this._engine = engine || Web3Utils.createEngine(wallet, url)
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddressString()
  }

  getProvider () {
    return this._engine
  }

  getPrivateKey () {
    return this._wallet && this._wallet.getPrivateKey && Buffer.from(this._wallet.getPrivateKey()).toString('hex')
  }

  createNewChildAddress (deriveNumber = 0) {
    const hdWallet = hdKey.fromMasterSeed(this._wallet.getPrivateKey())
    return hdWallet.derivePath(WALLET_HD_PATH + deriveNumber).getWallet()
  }
}
