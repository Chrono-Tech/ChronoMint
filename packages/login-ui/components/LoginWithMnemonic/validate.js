/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const mnemonic = values.get('mnemonic')

  const mnemonicErrors = new ErrorList()
  mnemonicErrors.add(validator.required(mnemonic))

  return {
    mnemonic: mnemonicErrors.getErrors(),
  }
}
