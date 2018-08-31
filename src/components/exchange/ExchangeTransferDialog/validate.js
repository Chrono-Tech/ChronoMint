/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'platform/ErrorList'

export default function validate (values, props) {

  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))
  amountErrors.add(validator.lowerThan(values.get('amount'), props.token.removeDecimals(props.maxAmount).toNumber(), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
