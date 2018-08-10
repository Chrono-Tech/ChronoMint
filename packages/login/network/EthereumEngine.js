/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Tx from 'ethereumjs-tx'
import Web3 from 'web3'
import hdKey from 'ethereumjs-wallet/hdkey'
import Web3Utils from './Web3Utils'
import { WALLET_HD_PATH } from './constants'

export default class EthereumEngine {
  constructor (network, url, engine, deriveNumber) {
    this._network = network
    const web3 = engine && new Web3(engine)
    try {
      this._address = engine && web3.eth.accounts[0]
    } catch (e) {
      // FIXME: what is that? Was merged as is long time ago.
      // dispatch(addError(e.message))
    }
    this._engine = engine || Web3Utils.createEngine(url, deriveNumber)
  }

  getAddress () {
    return
  }

  getPrivateKey () {
    return 
  }

  getNetwork () {
    return this._network
  }

  getProvider () {
    return this._engine
  }

}
