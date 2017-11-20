import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function validate (values) {
  let result = {}

  let buyErrors = new ErrorList()
  buyErrors.add(validator.positiveNumber(values.get('buy'), true))
  if (buyErrors.getErrors()) {
    result.buy = buyErrors.getErrors()
  }

  let sellErrors = new ErrorList()
  sellErrors.add(validator.positiveNumber(values.get('sell'), true))
  if (sellErrors.getErrors()) {
    result.sell = sellErrors.getErrors()
  }

  return result

}
