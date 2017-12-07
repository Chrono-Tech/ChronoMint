import ErrorList from 'components/forms/ErrorList'
import * as validator from 'components/forms/validator'

export default function validate (values) {
  let buyPriceErrors = new ErrorList()
  buyPriceErrors.add(validator.positiveNumber(values.get('buyPrice'), true))
  buyPriceErrors.add(validator.required(values.get('buyPrice')))

  let sellPriceErrors = new ErrorList()
  sellPriceErrors.add(validator.positiveNumber(values.get('sellPrice'), true))
  sellPriceErrors.add(validator.required(values.get('sellPrice')))

  buyPriceErrors.add(validator.lowerThan(values.get('buyPrice'), values.get('sellPrice'), true))

  let tokenErrors = new ErrorList()
  tokenErrors.add(validator.required(values.get('token')))

  return {
    buyPrice: buyPriceErrors.getErrors(),
    sellPrice: sellPriceErrors.getErrors(),
    token: tokenErrors.getErrors(),
  }
}
