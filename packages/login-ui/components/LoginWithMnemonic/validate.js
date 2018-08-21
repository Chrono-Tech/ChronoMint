/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from '@chronobank/core-dependencies/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {

  const mnemonic = values.get('mnemonic')

  let mnemonicErrors = new ErrorList()
  mnemonicErrors.add(validator.required(mnemonic))

  return {
    mnemonic: mnemonicErrors.getErrors(),
  }
}
