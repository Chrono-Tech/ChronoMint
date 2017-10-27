import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function (values) {
  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))

  return {
    amount: amountErrors.getErrors(),
  }
}
