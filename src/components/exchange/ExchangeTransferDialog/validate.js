import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function validate (values, props) {

  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))
  amountErrors.add(validator.lowerThan(values.get('amount'), props.maxAmount.toNumber()))

  return {
    amount: amountErrors.getErrors(),
  }
}
