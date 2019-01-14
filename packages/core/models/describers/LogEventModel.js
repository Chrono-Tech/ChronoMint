/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import Amount from '../Amount'
import AbstractModel from '../AbstractModel'
import { EVENT_TYPE_EVENT } from '../../describers/constants'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  address: PropTypes.string,
  category: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
  date: PropTypes.instanceOf(Date).isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
  amountTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
  isAmountSigned: PropTypes.bool,
  amount: PropTypes.oneOfType([Amount, PropTypes.instanceOf(null)]),
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(null)]),
})

export default class LogEventModel extends AbstractModel {
  constructor (data) {
    super(Object.assign({
      type: EVENT_TYPE_EVENT,
    }, data), schemaFactory())
    Object.freeze(this)
  }
}
