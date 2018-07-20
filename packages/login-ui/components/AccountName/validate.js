/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const password = values.get('accountName')

  let passwordErrors = new ErrorList()
  passwordErrors.add(validator.required(password))

  return {
    accountName: passwordErrors.getErrors(),
  }
}
