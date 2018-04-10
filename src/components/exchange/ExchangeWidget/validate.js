/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default function validate (values) {

  let amountErrors = new ErrorList()
  values.get('amount') && amountErrors.add(validator.positiveNumber(values.get('amount'), true))
  return {
    amount: amountErrors.getErrors(),
  }

}
