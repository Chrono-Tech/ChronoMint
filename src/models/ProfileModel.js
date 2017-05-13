import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

class ProfileModel extends abstractModel({
  name: null,
  email: null,
  company: null
}) {
  name () {
    return this.get('name')
  }

  email () {
    return this.get('email')
  }

  company () {
    return this.get('company')
  }

  // noinspection JSUnusedGlobalSymbols
  isEmpty () {
    return this.name() === null
  }
}

export const validate = values => {
  const errors = {}
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.email = ErrorList.toTranslate(validator.email(values.get('email'), false))
  errors.company = ErrorList.toTranslate(validator.name(values.get('company'), false))
  return errors
}

export default ProfileModel
