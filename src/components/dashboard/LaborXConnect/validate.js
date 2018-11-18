/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'utils/ErrorList'
import { FORM_LABOR_X_CONNECT } from '../../constants'

export default (values, props) => {
  const max = props.miningBalance.plus(props.deposit)
  const amount = values.get('amount')

  const amountErrors = new ErrorList()
  if (props.form === FORM_LABOR_X_CONNECT) {
    amountErrors.add(validator.required(amount))
    amountErrors.add(validator.positiveNumber(amount))
  }

  amountErrors.add(validator.lowerThan(amount, max.toNumber(), true))

  return {
    symbol: new ErrorList()
      .add(validator.required(values.get('symbol')))
      .getErrors(),
    amount: amountErrors.getErrors(),
  }
}
