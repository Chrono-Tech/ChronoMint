/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default (values) => {
  const errors = {}
  errors.title = ErrorList.toTranslate(validator.required(values.get('title')))

  return errors
}
