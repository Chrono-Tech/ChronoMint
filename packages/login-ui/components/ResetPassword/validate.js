/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'
import { PASSWORD_LENGTH_MIN } from '../constants'

const validateEqualPasswords = (password, confirmPassword) => password === confirmPassword ? null : 'Wrong password'

export default (values) => {

  const password = values.get('password')

  const passwordErrors = new ErrorList()
  passwordErrors.add(validator.required(password))
  passwordErrors.add(validator.longerThan(password, PASSWORD_LENGTH_MIN, true))

  const confirmPassword = values.get('confirmPassword')
  const confirmPasswordErrors = new ErrorList()
  confirmPasswordErrors.add(validator.required(confirmPassword))
  confirmPasswordErrors.add(validator.longerThan(password, PASSWORD_LENGTH_MIN, true))
  confirmPasswordErrors.add(validateEqualPasswords(password, confirmPassword))

  return {
    password: passwordErrors.getErrors(),
    confirmPassword: confirmPasswordErrors.getErrors(),
  }
}
