import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default (values, props) => {
  const amount = values.get('amount')

  return {
    amount: new ErrorList()
      .add(validator.required(amount))
      .add(validator.positiveNumberOrZero(amount))
      .getErrors(),
  }
}
