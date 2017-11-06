import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function (values) {
  let managerAddressErrors = new ErrorList()
  managerAddressErrors.add(validator.address(values.get('managerAddress'), true))

  return {
    managerAddress: managerAddressErrors.getErrors(),
  }
}
