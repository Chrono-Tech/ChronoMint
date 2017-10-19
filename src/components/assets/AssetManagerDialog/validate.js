import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function (values) {
  if (values.get('alreadyHave')) {
    return {}
  }

  let platformNameErrors = new ErrorList()
  platformNameErrors.add(validator.name(values.get('platformName'), true))

  let platformAddressErrors = new ErrorList()
  platformAddressErrors.add(validator.address(values.get('platformAddress'), true))

  return {
    platformName: platformNameErrors.getErrors(),
    platformAddress: platformAddressErrors.getErrors(),
  }
}
