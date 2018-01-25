import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

export default (value) => {
  if (!value) {
    return
  }
  return new ErrorList()
    // .add(validator.required(value))
    .add(validator.address(value))
    .getErrors()
}
