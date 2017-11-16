import ErrorList from 'components/forms/ErrorList'
import * as validator from 'components/forms/validator'

export default function validate (values) {
  let result = {}

  let buyPriceErrors = new ErrorList()
  buyPriceErrors.add(validator.positiveNumber(values.get('buyPrice'), true))
  buyPriceErrors.add(validator.required(values.get('buyPrice')))
  if (buyPriceErrors.getErrors()) {
    result.buyPrice = buyPriceErrors.getErrors()
  }

  let sellPriceErrors = new ErrorList()
  sellPriceErrors.add(validator.positiveNumber(values.get('sellPrice'), true))
  sellPriceErrors.add(validator.required(values.get('sellPrice')))
  if (sellPriceErrors.getErrors()) {
    result.sellPrice = sellPriceErrors.getErrors()
  }

  let tokenErrors = new ErrorList()
  tokenErrors.add(validator.required(values.get('token')))
  if (tokenErrors.getErrors()) {
    result.token = tokenErrors.getErrors()
  }

  return result

}
