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
    return this.get('name') === null
  }
}

// declarative
export const validateRules = {
  name: 'required|min:3',
  email: 'email',
  company: 'min:3',
}

/**
 * @deprecated use declarative rules
 * @param values
 * @return {*}
 */
export const validate = values => {
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.email = ErrorList.toTranslate(validator.email(values.get('email'), false))
  errors.company = ErrorList.toTranslate(validator.name(values.get('company'), false))
  return errors
}

export default ProfileModel
