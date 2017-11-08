import ErrorList from 'components/forms/ErrorList'
import validator from 'components/forms/validator'

export default function validate (values) {
  let result = {}

  let platformAddressErrors = new ErrorList()
  values.get('alreadyHave') && platformAddressErrors.add(validator.address(values.get('platformAddress'), true))
  if (platformAddressErrors.getErrors()) {
    result.platformAddress = platformAddressErrors.getErrors()
  }
  return result

}
