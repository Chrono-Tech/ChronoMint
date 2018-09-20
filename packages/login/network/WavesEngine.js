/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesAPI from '@waves/waves-api'

export class WavesEngine {
  constructor (wallet, network) {
    this._wallet = wallet
    this._network = network
    this._Waves = WavesAPI.create(network)
    this._Transactions = this._Waves.Transactions
  }

  getNetwork () {
    return this._network
  }

  getAddress () {
    return this._wallet.getAddress()
  }

  getPrivateKey () {
    return this._wallet.getPrivateKey()
  }

  getPublicKey () {
    return this._wallet.getPublicKey()
  }

  createTransaction (type, params) {
    const data = this.describeTransaction(type, params)

    const transferTransaction = new this._Transactions.TransferTransaction(data)

    return transferTransaction.prepareForAPI(this.getPrivateKey()).then((preparedData) => {
      return preparedData
    })
  }

}
