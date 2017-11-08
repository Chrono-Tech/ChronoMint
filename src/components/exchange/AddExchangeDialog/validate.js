import ErrorList from 'components/forms/ErrorList'
import * as validator from 'components/forms/validator'

export default function validate (values) {
  let result = {}

  let buyPriceErrors = new ErrorList()
  values.get('buyPrice') && buyPriceErrors.add(validator.positiveNumber(values.get('buyPrice'), true))
  if (buyPriceErrors.getErrors()) {
    result.buyPrice = buyPriceErrors.getErrors()
  }

  let sellPriceErrors = new ErrorList()
  values.get('sellPrice') && sellPriceErrors.add(validator.positiveNumber(values.get('sellPrice'), true))
  if (sellPriceErrors.getErrors()) {
    result.sellPrice = sellPriceErrors.getErrors()
  }

  let tokenErrors = new ErrorList()
  values.get('token') && tokenErrors.add(validator.required(values.get('token')))
  if (tokenErrors.getErrors()) {
    result.token = tokenErrors.getErrors()
  }

  return result

}
