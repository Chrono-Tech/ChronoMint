import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function validate (values) {
  let result = {}

  let amountErrors = new ErrorList()
  values.get('amount') && amountErrors.add(validator.positiveNumber(values.get('amount'), true))
  if (amountErrors.getErrors()) {
    result.amount = amountErrors.getErrors()
  }
  return result

}
