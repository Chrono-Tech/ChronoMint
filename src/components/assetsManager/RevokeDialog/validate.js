/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'

export default function validate (values) {
  let res = {}
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount')))
  amountErrors.add(validator.required(values.get('amount')))
  if (amountErrors.getErrors()) {
    res['amount'] = amountErrors.getErrors()
  }

  return res
}
