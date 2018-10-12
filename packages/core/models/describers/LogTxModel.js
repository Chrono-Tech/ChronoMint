/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'
import Amount from '../Amount'
import { EVENT_TYPE_TRANSACTION } from '../../describers/constants'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  symbol: PropTypes.string,
  type: PropTypes.string,
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
  fields: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.any,
    description: PropTypes.string,
  })),
})

export default class LogTxModel extends AbstractModel {
  constructor (data) {
    super(Object.assign({
      type: EVENT_TYPE_TRANSACTION,
    }, data), schemaFactory())
    Object.freeze(this)
  }
}
