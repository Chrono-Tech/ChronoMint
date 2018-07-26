/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'

const validateEqualPasswords = (password, confirmPassword) => password === confirmPassword ? null : 'Wrong password'

export default (values) => {
  const walletName = values.get('walletName')

  let walletNameErrors = new ErrorList()
  walletNameErrors.add(validator.required(walletName))

  const password = values.get('password')

  let passwordErrors = new ErrorList()
  passwordErrors.add(validator.required(password))

  const confirmPassword = values.get('confirmPassword')
  let confirmPasswordErrors = new ErrorList()
  confirmPasswordErrors.add(validator.required(confirmPassword))
  confirmPasswordErrors.add(validateEqualPasswords(password, confirmPassword))

  return {
    walletName: walletNameErrors.getErrors(),
    password: passwordErrors.getErrors(),
    confirmPassword: confirmPasswordErrors.getErrors(),
  }
}
