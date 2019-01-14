/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import { required, longerThan } from '@chronobank/core/models/validator'
import { PASSWORD_LENGTH_MIN } from '../constants'

const validateEqualPasswords = (password, confirmPassword) => password === confirmPassword ? null : 'Wrong password'

export default (values) => {
  const walletName = values.get('walletName')

  const walletNameErrors = new ErrorList()
  walletNameErrors.add(required(walletName))

  const password = values.get('password')

  const passwordErrors = new ErrorList()
  passwordErrors.add(required(password))
  passwordErrors.add(longerThan(password, PASSWORD_LENGTH_MIN, true))

  const confirmPassword = values.get('confirmPassword')
  const confirmPasswordErrors = new ErrorList()
  confirmPasswordErrors.add(required(confirmPassword))
  confirmPasswordErrors.add(longerThan(password, PASSWORD_LENGTH_MIN, true))
  confirmPasswordErrors.add(validateEqualPasswords(password, confirmPassword))

  return {
    walletName: walletNameErrors.getErrors(),
    password: passwordErrors.getErrors(),
    confirmPassword: confirmPasswordErrors.getErrors(),
  }
}
