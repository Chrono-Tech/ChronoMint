/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

export default (values) => {
  const alias = values.get('alias')

  let aliasErrors = new ErrorList()
  aliasErrors.add(validator.required(alias))

  const url = values.get('url')

  let urlErrors = new ErrorList()
  urlErrors.add(validator.required(url))
  urlErrors.add(validator.urlAddress(url))

  const ws = values.get('ws')

  let wsErrors = new ErrorList()
  wsErrors.add(validator.required(ws))
  wsErrors.add(validator.urlAddress(ws))

  return {
    alias: aliasErrors.getErrors(),
    url: urlErrors.getErrors(),
    ws: wsErrors.getErrors(),
  }
}
