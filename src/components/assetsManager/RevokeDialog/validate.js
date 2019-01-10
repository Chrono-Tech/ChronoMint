/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import validator from '@chronobank/core/models/validator'

export default function validate (values) {
  const res = {}
  const amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount')))
  amountErrors.add(validator.required(values.get('amount')))
  if (amountErrors.getErrors()) {
    res['amount'] = amountErrors.getErrors()
  }

  return res
}
