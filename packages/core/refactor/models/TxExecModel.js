/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { I18n } from '@chronobank/core-dependencies/i18n'
import BigNumber from 'bignumber.js'
import uuid from 'uuid/v1'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  contract: PropTypes.string,
  func: PropTypes.string,
  blockchain: PropTypes.string,
  symbol: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
  hash: PropTypes.string,
  fields: PropTypes.objectOf(PropTypes.shape({
    value: PropTypes.any,
    description: PropTypes.string,
  })),
  fee: PropTypes.shape({
    gasLimit: PropTypes.instanceOf(BigNumber),
    gasPrice: PropTypes.instanceOf(BigNumber),
    gasFee: PropTypes.instanceOf(BigNumber),
    feeMultiplier: PropTypes.number,
  }),
  data: PropTypes.string,
})

export default class TxExecModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    this._id = props._id || uuid()
    this.time = new Date().getTime()
    Object.assign(this, props)
    Object.freeze(this)
  }

  id () {
    return this._id
  }

  get args () {
    return Object.values(this.fields).map((field) => field.value)
  }

  get langPrefix () {
    return this.i18nFunc()
  }

  /**
   * @returns {string}
   * @private
   */
  _i18n () {
    return `tx.${this.contract}.`
  }

  i18nFunc () {
    return `${this._i18n() + this.func}.`
  }

  funcTitle () {
    return `${this.i18nFunc()}title`
  }

  title () {
    return I18n.t(this.func)
  }

  details () {
    let details = []
    Object.entries(this.fields).map(([, field]) => {
      details.push({
        label: I18n.t(`${this.i18nFunc()}${field.description}`),
        value: field.value,
      })
    })
    return details
  }
}
