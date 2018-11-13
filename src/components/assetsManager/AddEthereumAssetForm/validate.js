/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '../../../../packages/core/models/validator'

const validateSmallestUnit = (value) => validator.between(value, 0.00000000000000000001, 0.1, true)

export const normalizeSmallestUnit = (value) => validateSmallestUnit(value) ? 0 : value

export default function validate (values) {
  const result = {}
  const platformErrors = new ErrorList()
  platformErrors.add(validator.required(values.get('platform')))
  if (platformErrors.getErrors()) {
    result.platform = platformErrors.getErrors()
  }

  const tokenSymbolErrors = new ErrorList()
  tokenSymbolErrors.add(validator.name(values.get('symbol'), true))
  tokenSymbolErrors.add(validator.bytes32(values.get('symbol')))
  if (tokenSymbolErrors.getErrors()) {
    result.tokenSymbol = tokenSymbolErrors.getErrors()
  }

  const smallestUnitErrors = new ErrorList()
  smallestUnitErrors.add(validateSmallestUnit(values.get('smallestUnit')))
  if (smallestUnitErrors.getErrors()) {
    result.smallestUnit = smallestUnitErrors.getErrors()
  }

  const amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount')))
  amountErrors.add(validator.required(values.get('amount')))
  if (amountErrors.getErrors()) {
    result.amount = amountErrors.getErrors()
  }

  const feePercentErrors = new ErrorList()
  const feeAddressErrors = new ErrorList()
  if (values.get('withFee')) {
    feePercentErrors.add(validator.positiveNumber(values.get('feePercent')))
    feePercentErrors.add(validator.required(values.get('feePercent')))
    feeAddressErrors.add(validator.address(values.get('feeAddress'), true))
  }
  if (feePercentErrors.getErrors()) {
    result.feePercent = feePercentErrors.getErrors()
  }
  if (feeAddressErrors.getErrors()) {
    result.feeAddress = feeAddressErrors.getErrors()
  }

  return result
}

