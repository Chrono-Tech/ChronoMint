import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

export default (value, addressList) => {
  if (!value) {
    return
  }
  return new ErrorList()
    .add(validator.address(value))
    .add(validator.uniqueAddress(value, addressList))
    .getErrors()
}
