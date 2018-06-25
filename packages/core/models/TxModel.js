/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { FULL_DATE } from './constants'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { abstractModel } from './AbstractModel'

class TxModel extends abstractModel({
  txHash: null,
  blockHash: null,
  blockNumber: null,
  transactionIndex: null,
  from: null,
  to: null,
  by: null,
  value: new BigNumber(0),
  time: null,
  gasPrice: null,
  gas: null,
  fee: new BigNumber(0), // TODO @ipavlenko: remove gasFee, use fee
  gasFee: new BigNumber(0),
  input: null,
  symbol: '',
  tokenAddress: null,
  type: '',
  token: null, // address
  args: null,
  blockchain: null,
}) {
  tokenAddress (value) {
    return this._getSet('tokenAddress', value)
  }

  blockchain (value) {
    return this._getSet('blockchain', value)
  }

  blockNumber (value) {
    return this._getSet('blockNumber', value)
  }

  to () {
    return this.get('to')
  }

  by () {
    return this.get('by')
  }

  args () {
    return this.get('args')
  }

  type () {
    return this.get('type')
  }

  from () {
    return this.get('from')
  }

  txHash () {
    return this.get('txHash')
  }

  id () {
    return `${this.blockchain()}-${this.txHash()}-${this.from()}-${this.to()}`
  }

  time () {
    return moment(this.get('time')).format(FULL_DATE)
  }

  date (format) {
    return moment(this.get('time')).format(format)
  }

  value (): BigNumber {
    return this.get('value')
  }

  isCredited (account) {
    if (account === this.from()) {
      return false
    }
    if (account === this.to()) {
      return true
    }
  }

  // noinspection JSUnusedGlobalSymbols
  sign () {
    return this.isCredited() ? '+' : '-'
  }

  symbol () {
    return this.get('symbol')
  }

  fee () {
    return this.get('fee')
  }

  isFromEmpty () {
    return this.from() === '0x0000000000000000000000000000000000000000'
  }

  /**
   * @deprecated
   */
  token (value) {
    return this._getSet('token', value)
  }
}

export default TxModel
