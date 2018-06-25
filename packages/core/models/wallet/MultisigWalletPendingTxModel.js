/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'

import { abstractFetchingModel } from '../AbstractFetchingModel'
import TxExecModel from '../TxExecModel'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  to: null,
  value: new BigNumber(0),
  isConfirmed: false,
  decodedTx: new TxExecModel(), // decoded data
}) {
  id () {
    return this.get('id') || Math.random()
  }

  to () {
    return this.get('to')
  }

  value () {
    return this.get('value')
  }

  isConfirmed (value: boolean) {
    return this._getSet('isConfirmed', value)
  }

  decodedTx (value) {
    return this._getSet('decodedTx', value)
  }

  txRevokeSummary () {
    return {
      transaction: this.id(),
    }
  }

  title () {
    return this.decodedTx().title()
  }

  details () {
    return this.decodedTx().details()
  }
}

export default MultisigWalletPendingTxModel
