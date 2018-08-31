/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import { required, email as emailValidator } from '@chronobank/core/models/validator'

export default (values) => {

  const email = values.get('email')
  let emailErrors = new ErrorList()
  emailErrors.add(required(email))
  emailErrors.add(emailValidator(email))

  return {
    email: emailErrors.getErrors(),
  }
}
