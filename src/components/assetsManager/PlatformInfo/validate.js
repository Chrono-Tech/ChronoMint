/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'

export default function (values) {
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
