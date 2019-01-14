/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import validator from '@chronobank/core/models/validator'

export default function (values) {
  let managerAddressErrors = new ErrorList()
  managerAddressErrors.add(validator.address(values.get('managerAddress'), true))

  return {
    managerAddress: managerAddressErrors.getErrors(),
  }
}
