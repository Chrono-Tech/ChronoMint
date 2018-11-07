/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'utils/ErrorList'

export default (values, props) => {
  const amount = values.get('amount')

  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.positiveNumber(amount))

  amountErrors.add(validator.lowerThan(amount, props.deposit.toNumber(), true))

  return {
    symbol: new ErrorList()
      .add(validator.required(values.get('symbol')))
      .getErrors(),
    amount: amountErrors.getErrors(),
  }
}
