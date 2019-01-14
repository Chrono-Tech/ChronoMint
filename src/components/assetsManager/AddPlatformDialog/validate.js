/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import validator from '@chronobank/core/models/validator'

export default function validate (values) {
  const result = {}

  const platformAddressErrors = new ErrorList()
  values.get('alreadyHave') && platformAddressErrors.add(validator.address(values.get('platformAddress'), true))
  if (platformAddressErrors.getErrors()) {
    result.platformAddress = platformAddressErrors.getErrors()
  }
  return result

}
