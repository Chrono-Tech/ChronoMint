/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import { Map } from 'immutable'
import moment from 'moment'
import uuid from 'uuid/v1'
import { abstractModel } from './AbstractModelOld'

class TxExecModel extends abstractModel({
  contract: '',
  func: '',
  args: {},
  value: new BigNumber(0),
  gas: new BigNumber(0),
  isGasUsed: false,
  estimateGasLaxity: new BigNumber(0),
  hash: null,
  additionalAction: null,
  params: null,
  gasLimit: null,
  gasPrice: null,
  options: {},
  data: null,
}) {
  constructor (data) {
    super({
      id: (data && data.id) || uuid(),
      ...data,
    })
  }

  additionalAction (value) {
    return this._getSet('additionalAction', value)
  }

  params (value) {
    return this._getSet('params', value)
  }

  options (options) {
    return this._getSet('options', options)
  }

  isAdvancedFeeMode () {
    const options = this.get('options')
    return options.advancedParams && options.advancedParams.mode === 'advanced'
  }

  isSkipSlider () {
    const options = this.get('options')
    return !!(options.advancedParams && (options.advancedParams.mode || options.advancedParams.skipSlider))
  }

  time () {
    return moment(this.get('timestamp')).format('Do MMMM YYYY HH:mm:ss')
  }

  date (format) {
    const time = this.get('timestamp') / 1000
    return time && moment.unix(time).format(format || 'HH:mm, MMMM Do, YYYY') || null
  }

  contract () {
    return this.get('contract')
  }

  funcName () {
    return this.get('func')
  }

  args () {
    return this.get('args') || {}
  }

  gas (): BigNumber {
    return this.get('gas')
  }

  setGas (v: BigNumber, isGasUsed = false): TxExecModel {
    return this.set('gas', v)
      .set('isGasUsed', isGasUsed)
      .set('estimateGasLaxity', isGasUsed ? this.gas().minus(v) : new BigNumber(0))
  }

  gasPrice (value: BigNumber) {
    return this._getSet('gasPrice', value)
  }

  gasLimit (value) {
    return this._getSet('gasLimit', value)
  }

  isGasUsed () {
    return this.get('isGasUsed')
  }

  estimateGasLaxity (): BigNumber {
    return this.get('estimateGasLaxity')
  }

  value (): BigNumber {
    return this.get('value')
  }

  hash () {
    return this.get('hash')
  }

  /**
   * @returns {string}
   * @private
   */
  _i18n () {
    return `tx.${this.get('contract')}.`
  }

  i18nFunc () {
    return `${this._i18n() + this.funcName()}.`
  }

  func () {
    return `${this.i18nFunc()}title`
  }

  title () {
    return this.func()
  }

  details () {
    const args = this.args()
    const list = new Map(Object.entries(args))

    return list.entrySeq().map(([key, value]) => {
      return ({
        label: this.i18nFunc() + key,
        value,
      })
    })
  }
}

export default TxExecModel
