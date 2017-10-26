import validator from 'components/forms/validator'
import ErrorList from 'components/forms/ErrorList'

export default function validate (values) {
  let result = {}
  let platformNameErrors = new ErrorList()

  platformNameErrors.add(validator.name(values.get('platformName'), true))
  if (platformNameErrors.getErrors()) {
    result.platformName = platformNameErrors.getErrors()
  }

  let platformAddressErrors = new ErrorList()
  values.get('alreadyHave') && platformAddressErrors.add(validator.address(values.get('platformAddress'), true))
  if (platformAddressErrors.getErrors()) {
    result.platformAddress = platformAddressErrors.getErrors()
  }
  return result

}
