import validator from '../../forms/validator'
import ErrorList from '../../forms/ErrorList'

export default (values) => {
  const amount = values.get('amount')
  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.currencyNumber(amount))
  return {
    amount: amountErrors.getErrors()
  }
}
