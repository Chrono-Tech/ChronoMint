/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import moment from 'moment'
import uniqid from 'uniqid'
import BigNumber from 'bignumber.js'
import { I18n } from '../utils/i18n'
import { abstractModel } from './AbstractModel'
import TokenModel from './tokens/TokenModel'

export default class TransferExecModel extends abstractModel({
  title: 'tx.General.transfer.title',
  operation: 'transfer',
  from: null,
  to: null,
  amount: new BigNumber(0),
  amountToken: null,
  fee: new BigNumber(0),
  feeToken: null,
  hash: null,
  // TODO @ipavlenko: This is "extra" field, token-specific
  feeMultiplier: 1,
  options: {},
}) {
  constructor (data = {}) {
    super({
      id: (data && data.id) || uniqid(),
      ...data,
    })
  }

  contract (): String {
    return this.get('contract')
  }

  options (options) {
    return this._getSet('options', options)
  }

  isAdvancedFeeMode () {
    const options = this.get('options')
    return typeof options.advancedParams === 'object'
  }

  from (value: String): String {
    return this._getSet('from', value)
  }

  to (value: String): String {
    return this._getSet('to', value)
  }

  amount (value: BigNumber): BigNumber {
    return this._getSet('amount', value)
  }

  amountToken (value: TokenModel): TokenModel {
    return this._getSet('amountToken', value)
  }

  fee (value: BigNumber): BigNumber {
    return this._getSet('fee', value)
  }

  feeToken (value: TokenModel): TokenModel {
    return this._getSet('feeToken', value)
  }

  feeMultiplier (value: Number): Number {
    return this._getSet('feeMultiplier', value)
  }

  timestamp (value: Number): Number {
    return this._getSet('timestamp', value)
  }

  time () {
    return moment(this.get('timestamp')).format('Do MMMM YYYY HH:mm:ss')
  }

  date (format) {
    const time = this.get('timestamp') / 1000
    return time && moment.unix(time).format(format || 'HH:mm, MMMM Do, YYYY') || null
  }

  title (): String {
    return I18n.t(this.get('title'))
  }

  operation (value: String): String {
    return this._getSet('operation', value)
  }

  hash (value: String): String {
    return this._getSet('hash', value)
  }

  txSummary () {
    // Property path should be used to find proper i18n strings
    // Place here only contract-related data
    return {
      // operation: this.get('operation'),
      // [this.get('operation')]: {
      //
      // }
    }
  }
}
