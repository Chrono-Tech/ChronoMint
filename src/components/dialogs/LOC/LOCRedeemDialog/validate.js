/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values, props) => {
  const amount = +values.get('amount')
  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.positiveInt(amount))
  if (amount > props.loc.issued()) {
    amountErrors.add('errors.greaterThanAllowed')
  }

  return {
    amount: amountErrors.getErrors(),
  }
}
