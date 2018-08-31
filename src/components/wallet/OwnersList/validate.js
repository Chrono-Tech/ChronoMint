/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (value, values, props) => {
  if (!value) {
    return
  }

  const owners = values.get('owners').valueSeq().toArray().map((item) => item.address)
  owners.push(props.account)

  return new ErrorList()
    .add(validator.address(value))
    .add(validator.unique(value, owners))
    .getErrors()
}
