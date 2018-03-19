import * as validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default function (values) {
  return {
    userAddress: new ErrorList()
      .add(validator.address(values.get('userAddress'), true))
      .getErrors(),
  }
}
