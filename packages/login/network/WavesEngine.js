/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import type BigNumber from 'bignumber.js'
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
    console.log('Waves get address:')
    console.log(this._wallet)
    return this._wallet.getAddress()
  }

  getPrivateKey () {
    return this._wallet.getPrivateKey()
  }

  describeTransaction (type, params) {
    switch (type) {
      case 'ISSUE' :
        return this._describeIssueTransaction(params)
      case 'TRANSFER' :
        return this._describeTransferTransaction(params)
      default:
        return null;
    }
  }


  createTransaction (type, params) {

    const data = this.describeTransaction(type, params)

    const transferTransaction = new this._Transactions.TransferTransaction(data);

    const api = transferTransaction.prepareForAPI(keys.privateKey).then((preparedData) => {
      return preparedData
    })

  }

  _describeIssueTransaction (name, description, amount: BigNumber, reissuable = false) {
    const issueData = {

      name: name,
      description: description,

      quantity: amount,
      precision: 5,

      // This flag defines whether additional emission is possible
      reissuable: reissuable,

      fee: 100000000,
      timestamp: Date.now()

    }
    return issueData
  }

  _describeTransferTransaction (to, amount: BigNumber, feeRate: Number, asset) {
    const transferData = {

      // An arbitrary address; mine, in this example
      recipient: to,

      // ID of a token, or WAVES
      assetId: asset,

      // The real amount is the given number divided by 10^(precision of the token)
      amount: amount,

      // The same rules for these two fields
      feeAssetId: 'WAVES',
      fee: 100000,

      // 140 bytes of data (it's allowed to use Uint8Array here)
      attachment: '',

      timestamp: Date.now()

    }
    return transferData
  }

}
