/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default function validate (values) {
  let confirmTokenErrors = new ErrorList()
  confirmTokenErrors.add(validator.confirm2FACode(values.get('confirmToken')))

  return {
    confirmToken: confirmTokenErrors.getErrors(),
  }
}
