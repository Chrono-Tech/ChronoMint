import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function validate (values) {
  let res = {}
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount')))
  amountErrors.add(validator.required(values.get('amount')))
  if (amountErrors.getErrors()) {
    res['amount'] = amountErrors.getErrors()
  }

  return res
}
