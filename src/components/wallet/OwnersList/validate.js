import ErrorList from 'platform/ErrorList'
import * as validator from 'models/validator'

export default (value, values, props) => {
  if (!value) {
    return
  }

  const owners = values.get('owners').valueSeq().toArray().map((item) => item.address)
  owners.push(props.account)

  return new ErrorList()
    .add(validator.address(value))
    .add(validator.unique(value, owners))
    .getErrors()
}
