/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { I18n } from '@chronobank/core-dependencies/i18n'
import BigNumber from 'bignumber.js'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  contract: PropTypes.string,
  func: PropTypes.string,
  blockchain: PropTypes.string,
  symbol: PropTypes.string,
  from: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
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
    Object.assign(this, props)
    Object.freeze(this)
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
}
