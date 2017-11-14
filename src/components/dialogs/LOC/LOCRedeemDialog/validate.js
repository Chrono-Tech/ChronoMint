import ErrorList from '../../../forms/ErrorList'
import * as validator from '../../../forms/validator'

export default (values, props) => {
  const amount = +values.get('amount')
  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.positiveInt(amount))
  if (amount > props.loc.issued()) {
    amountErrors.add('errors.greaterThanAllowed')
  }

  return {
    amount: amountErrors.getErrors(),
  }
}
