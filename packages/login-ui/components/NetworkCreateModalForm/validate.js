/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from '../../../core/models/validator'

export default (values) => {
  const alias = values.get('alias')

  let aliasErrors = new ErrorList()
  aliasErrors.add(validator.required(alias))

  const url = values.get('url')

  let urlErrors = new ErrorList()
  urlErrors.add(validator.required(url))

  return {
    alias: aliasErrors.getErrors(),
    url: urlErrors.getErrors(),
  }
}
