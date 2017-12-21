import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default (values) => {
  const amount = values.get('amount')

  return {
    symbol: new ErrorList()
      .add(validator.required(values.get('symbol')))
      .getErrors(),
    amount: new ErrorList()
      .add(validator.required(amount))
      .add(validator.positiveNumberOrZero(amount))
      .getErrors(),
  }
}
