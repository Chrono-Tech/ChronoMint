import {Record as record} from 'immutable'
import * as validation from '../components/forms/validate'

class UserModel extends record({
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

  isEmpty () {
    return this.name() === null
  }
}

export const validate = values => {
  const errors = {}
  errors.name = validation.name(values.get('name'))
  errors.email = validation.email(values.get('email'), false)
  errors.company = validation.name(values.get('company'), false)
  return errors
}

export default UserModel
