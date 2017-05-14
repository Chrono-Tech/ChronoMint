import { abstractModel } from './AbstractModel'
import * as validation from '../components/forms/validate'

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

export const validate = values => {
  const errors = {}
  errors.name = validation.name(values.get('name'))
  errors.email = validation.email(values.get('email'), false)
  errors.company = validation.name(values.get('company'), false)
  return errors
}

export default ProfileModel
