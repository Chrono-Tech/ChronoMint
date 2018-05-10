/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'
import TokenModel from 'models/tokens/TokenModel'

const validateSmallestUnit = (value) => validator.between(value, 0, 20, true)

export default function validate (token: TokenModel) {

  let addressErrors = new ErrorList()
  addressErrors.add(validator.address(token.address(), true))

  let nameErrors = new ErrorList()
  nameErrors.add(validator.name(token.name(), false))

  let symbolErrors = new ErrorList()
  symbolErrors.add(validator.name(token.symbol(), true))
  symbolErrors.add(validator.bytes32(token.symbol()))

  let decimalsErrors = new ErrorList()
  decimalsErrors.add(validateSmallestUnit(token.decimals()))

  return {
    address: addressErrors.getErrors(),
    symbol: symbolErrors.getErrors(),
    decimals: decimalsErrors.getErrors(),
    name: nameErrors.getErrors(),
  }
}
