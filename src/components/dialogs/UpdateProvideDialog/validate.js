/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import validator from '@chronobank/core/models/validator'

export default (values) => {
  const errors = {}
  errors.userName = ErrorList.toTranslate(validator.name(values.get('userName')))
  errors.website = ErrorList.toTranslate(validator.url(values.get('website'), false))
  errors.email = ErrorList.toTranslate(validator.email(values.get('email'), false))
  errors.company = ErrorList.toTranslate(validator.name(values.get('company'), false))
  return errors
}
