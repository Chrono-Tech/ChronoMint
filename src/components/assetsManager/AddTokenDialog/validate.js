/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import ErrorList from 'utils/ErrorList'
import * as validator from '@chronobank/core/models/validator'

const validateSmallestUnit = (value) => validator.between(value, 0, 20, true)

export const normalizeSmallestUnit = (value) => validateSmallestUnit(value) ? 0 : value

export default function validate (values) {
  const result = {}
  const platformErrors = new ErrorList()
  platformErrors.add(validator.required(values.get('platform')))
  if (platformErrors.getErrors()) {
    result.platform = platformErrors.getErrors()
  }

  const tokenSymbolErrors = new ErrorList()
  tokenSymbolErrors.add(validator.name(values.get('tokenSymbol'), true))
  tokenSymbolErrors.add(validator.bytes32(values.get('tokenSymbol')))
  if (tokenSymbolErrors.getErrors()) {
    result.tokenSymbol = tokenSymbolErrors.getErrors()
  }

  const descriptionErrors = new ErrorList()
  descriptionErrors.add(validator.required(values.get('description')))
  if (descriptionErrors.getErrors()) {
    result.description = descriptionErrors.getErrors()
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
