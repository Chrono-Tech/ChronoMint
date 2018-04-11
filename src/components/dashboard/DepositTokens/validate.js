/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default (values) => {
  const amount = values.get('amount')

  return {
    symbol: new ErrorList()
      .add(validator.required(values.get('symbol')))
      .getErrors(),
    amount: new ErrorList()
      .add(validator.required(amount))
      .add(validator.positiveNumber(amount))
      .getErrors(),
  }
}
