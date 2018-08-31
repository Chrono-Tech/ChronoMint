/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

const validateSmallestUnit = (value) => validator.between(value, 0, 20, true)

export const normalizeSmallestUnit = (value) => validateSmallestUnit(value) ? 0 : value

export default function validate (values) {
  let addressErrors = new ErrorList()
  addressErrors.add(validator.address(values.get('address')))

  let nameErrors = new ErrorList()
  nameErrors.add(validator.name(values.get('name')))

  let symbolErrors = new ErrorList()
  symbolErrors.add(validator.name(values.get('symbol')))

  let decimalsErrors = new ErrorList()
  decimalsErrors.add(validateSmallestUnit(values.get('decimals')))

  let urlErrors = new ErrorList()
  urlErrors.add(validator.url(values.get('url')))

  return {
    address: addressErrors.getErrors(),
    name: nameErrors.getErrors(),
    symbol: symbolErrors.getErrors(),
    decimals: decimalsErrors.getErrors(),
    url: urlErrors.getErrors(),
  }
}
