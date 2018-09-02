/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values, props) => {
  const requiredSignatures = values.get('requiredSignatures')
  const limit = props.initialValues.get('ownersCount')

  return {
    requiredSignatures: new ErrorList()
      .add(validator.required(requiredSignatures))
      .add(validator.positiveNumber(requiredSignatures))
      .add(validator.lowerThan(requiredSignatures, limit, true))
      .getErrors(),
  }
}
