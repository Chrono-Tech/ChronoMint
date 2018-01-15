import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'

export default function (values) {
  let managerAddressErrors = new ErrorList()
  managerAddressErrors.add(validator.address(values.get('managerAddress'), true))

  return {
    managerAddress: managerAddressErrors.getErrors(),
  }
}
