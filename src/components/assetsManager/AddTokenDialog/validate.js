import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

const validateSmallestUnit = (value) => validator.between(value, 0, 20, true)

export const normalizeSmallestUnit = (value) => validateSmallestUnit(value) ? 0 : value

export default function validate (values) {
  const result = {}
  let platformErrors = new ErrorList()
  platformErrors.add(validator.required(values.get('platform')))
  if (platformErrors.getErrors()) {
    result.platform = platformErrors.getErrors()
  }

  let tokenSymbolErrors = new ErrorList()
  tokenSymbolErrors.add(validator.name(values.get('tokenSymbol'), true))
  if (tokenSymbolErrors.getErrors()) {
    result.tokenSymbol = tokenSymbolErrors.getErrors()
  }

  let descriptionErrors = new ErrorList()
  descriptionErrors.add(validator.required(values.get('description')))
  if (descriptionErrors.getErrors()) {
    result.description = descriptionErrors.getErrors()
  }

  let smallestUnitErrors = new ErrorList()
  smallestUnitErrors.add(validateSmallestUnit(values.get('smallestUnit')))
  if (smallestUnitErrors.getErrors()) {
    result.smallestUnit = smallestUnitErrors.getErrors()
  }

  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount')))
  amountErrors.add(validator.required(values.get('amount')))
  if (amountErrors.getErrors()) {
    result.amount = amountErrors.getErrors()
  }

  let feePercentErrors = new ErrorList()
  let feeAddressErrors = new ErrorList()
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
