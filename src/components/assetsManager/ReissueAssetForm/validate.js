import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function (values) {
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
