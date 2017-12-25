import validator from 'models/validator'
import ErrorList from 'platform/ErrorList'

export default function (values) {
  return {
    managerAddress: new ErrorList()
      .add(validator.address(values.get('managerAddress'), true))
      .getErrors(),
  }
}
