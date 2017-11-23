import * as validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function validate (values, props) {
  let result = {}

  let amountErrors = new ErrorList()
  amountErrors.add(validator.positiveNumber(values.get('amount'), true))
  if (values.get('amount') > props.maxAmount) {
    amountErrors.add(`components.exchange.ExchangeTransferDialog.maxAmountError`)
  }

  if (amountErrors.getErrors()) {
    result.amount = amountErrors.getErrors()
  }

  return result
}
