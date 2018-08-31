/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'platform/ErrorList'

export default (values, props) => {
  const amount = values.get('amount')

  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.positiveNumber(amount))

  if (amount) {
    if (props.isWithdraw) {
      amountErrors.add(validator.lowerThan(amount, props.token.removeDecimals(props.deposit).toNumber(), true))
    } else {
      amountErrors.add(validator.lowerThan(amount, props.token.removeDecimals(props.balance).toNumber(), true))
    }
  }

  return {
    symbol: new ErrorList()
      .add(validator.required(values.get('symbol')))
      .getErrors(),
    amount: amountErrors.getErrors(),
  }
}
