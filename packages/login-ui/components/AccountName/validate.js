/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const accountName = values.get('accountName')

  let accountNameErrors = new ErrorList()
  accountNameErrors.add(validator.required(accountName))

  return {
    accountName: accountNameErrors.getErrors(),
  }
}
