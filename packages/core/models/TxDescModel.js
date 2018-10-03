/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { Amount } from './'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  time: PropTypes.number,
  blockNumber: PropTypes.number,
  blockchain: PropTypes.string,
  hash: PropTypes.string,
  title: PropTypes.string,
  value: PropTypes.instanceOf(Amount),
  confirmations: PropTypes.number,
  fee: PropTypes.instanceOf(Amount),
  params: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
  details: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      type: PropTypes.string,
      value: PropTypes.any,
    }),
  ),
})

export default class TxDescModel extends AbstractModel {
  constructor (data, options) {
    super(data, schemaFactory(), options)
    Object.freeze(this)
  }

  get id () {
    return this.hash
  }
}
