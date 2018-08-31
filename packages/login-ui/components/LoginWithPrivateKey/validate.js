/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const privateKey = values.get('pk')

  let privateKeyErrors = new ErrorList()
  privateKeyErrors.add(validator.required(privateKey))

  return {
    pk: privateKeyErrors.getErrors(),
  }
}
