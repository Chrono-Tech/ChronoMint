/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import validator from '@chronobank/core/models/validator'
import ErrorList from '@chronobank/core-dependencies/ErrorList'

export default function (values) {
  return {
    managerAddress: new ErrorList()
      .add(validator.address(values.get('managerAddress'), true))
      .getErrors(),
  }
}
