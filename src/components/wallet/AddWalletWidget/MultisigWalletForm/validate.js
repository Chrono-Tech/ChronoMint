/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {
  const requiredSignatures = values.get('requiredSignatures')

  return {
    requiredSignatures: new ErrorList()
      .add(validator.required(requiredSignatures))
      .add(validator.positiveNumber(requiredSignatures))
      .getErrors(),
  }
}
