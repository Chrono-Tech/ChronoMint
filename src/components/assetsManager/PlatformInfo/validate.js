import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'

export default function (values) {
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
