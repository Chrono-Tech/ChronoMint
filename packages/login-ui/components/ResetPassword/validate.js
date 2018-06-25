/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

const validateEqualPasswords = (password, confirmPassword) => password === confirmPassword ? null : 'Wrong password'

export default (values) => {

  const password = values.get('password')

  let passwordErrors = new ErrorList()
  passwordErrors.add(validator.required(password))

  const confirmPassword = values.get('confirmPassword')
  let confirmPasswordErrors = new ErrorList()
  confirmPasswordErrors.add(validator.required(confirmPassword))
  confirmPasswordErrors.add(validateEqualPasswords(password, confirmPassword))

  return {
    password: passwordErrors.getErrors(),
    confirmPassword: confirmPasswordErrors.getErrors(),
  }
}
