/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from '@chronobank/core/models/validator'
import ErrorList from 'platform/ErrorList'

export default function (values) {
  return {
    userAddress: new ErrorList()
      .add(validator.address(values.get('userAddress'), true))
      .getErrors(),
  }
}
