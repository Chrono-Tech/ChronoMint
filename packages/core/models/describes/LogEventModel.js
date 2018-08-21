/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'
import Amount from '../Amount'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  category: PropTypes.string,
  date: PropTypes.instanceOf(Date).isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  message: PropTypes.string,
  amountTitle: PropTypes.string,
  isAmountSigned: PropTypes.bool,
  amount: PropTypes.instanceOf(Amount),
  target: PropTypes.string,
})

export default class LogEventModel extends AbstractModel {
  constructor (data) {
    super(data, schemaFactory())
    Object.freeze(this)
  }
}
