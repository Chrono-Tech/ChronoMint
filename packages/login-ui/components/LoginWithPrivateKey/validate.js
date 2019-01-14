/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const privateKey = values.get('pk')

  const privateKeyErrors = new ErrorList()
  privateKeyErrors.add(validator.required(privateKey))
  privateKeyErrors.add(validator.privateKey(privateKey))

  return {
    pk: privateKeyErrors.getErrors(),
  }
}
