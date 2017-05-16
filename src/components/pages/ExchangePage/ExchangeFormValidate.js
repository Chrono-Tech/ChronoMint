import validator from '../../forms/validator'
import ErrorList from '../../forms/ErrorList'

export default (values, props) => {
  const accountBalance = props.balances[values.get('currency')]
  const platformBalance = props.balances[values.get('currency')]
  const amount = values.get('amount')
  const amountErrors = new ErrorList()
  amountErrors.add(validator.required(amount))
  amountErrors.add(validator.currencyNumber(amount))
  if (values.get('buy')) {
    if (amount > platformBalance) {
      amountErrors.add('errors.platformNotEnoughTokens')
    }
  } else {
    if (amount > accountBalance) {
      amountErrors.add('errors.notEnoughTokens')
    }
  }

  return {
    amount: amountErrors.getErrors()
  }
}
