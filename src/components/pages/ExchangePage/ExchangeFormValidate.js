import * as validator from '../../forms/validate'

export default (values) => {
  const errors = {}

  const amount = values.get('amount')
  if (!amount) {
    errors.amount = 'Enter amount for exchange'
  }
  const amountCurrencyError = validator.currencyNumber(amount)
  if (amountCurrencyError) {
    errors.amount = amountCurrencyError
  }

  return errors
}
