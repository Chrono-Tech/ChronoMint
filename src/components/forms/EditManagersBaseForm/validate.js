import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function (values) {
  return {
    managerAddress: new ErrorList()
      .add(validator.address(values.get('managerAddress'), true))
      .getErrors(),
  }
}
