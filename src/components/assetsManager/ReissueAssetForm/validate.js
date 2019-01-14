/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import validator from '@chronobank/core/models/validator'

export default function (values) {
  const amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
