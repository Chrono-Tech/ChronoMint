import ErrorList from 'components/forms/ErrorList'
import * as validator from 'components/forms/validator'

export default function validate (values) {
  let result = {}

  let buyPriceErrors = new ErrorList()
  buyPriceErrors.add(validator.positiveNumber(values.get('buyPrice'), true))
  buyPriceErrors.add(validator.required(values.get('buyPrice')))

  let sellPriceErrors = new ErrorList()
  sellPriceErrors.add(validator.positiveNumber(values.get('sellPrice'), true))
  sellPriceErrors.add(validator.required(values.get('sellPrice')))
  if (sellPriceErrors.getErrors()) {
    result.sellPrice = sellPriceErrors.getErrors()
  }

  if (values.get('buyPrice') > values.get('sellPrice')) {
    buyPriceErrors.add('components.exchange.AddExchangeForm.buyPriceError')
  }

  if (buyPriceErrors.getErrors()) {
    result.buyPrice = buyPriceErrors.getErrors()
  }

  let tokenErrors = new ErrorList()
  tokenErrors.add(validator.required(values.get('token')))
  if (tokenErrors.getErrors()) {
    result.token = tokenErrors.getErrors()
  }

  return result

}
