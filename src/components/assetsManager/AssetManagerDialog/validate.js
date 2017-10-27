import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function (values) {
  let managerAddressErrors = new ErrorList()
  managerAddressErrors.add(validator.address(values.get('managerAddress'), true))

  return {
    managerAddress: managerAddressErrors.getErrors(),
  }
}
