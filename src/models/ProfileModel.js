import Immutable from 'immutable'
import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

class ProfileModel extends abstractModel({
  name: null,
  email: null,
  company: null,
  url: null,
  icon: null,
  tokens: new Immutable.Set(),
}) {
  constructor (data = {}) {
    data = data || {}
    super({
      ...data,
      tokens: new Immutable.Set(data.tokens || undefined)
    })
  }

  name () {
    return this.get('name')
  }

  email () {
    return this.get('email')
  }

  company () {
    return this.get('company')
  }

  url () {
    return this.get('url')
  }

  icon () {
    return this.get('icon')
  }

  tokens () {
    return this.get('tokens')
  }

  isEmpty () {
    return this.get('name') === null
  }
}

export const validate = values => {
  const errors = {}
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.url = ErrorList.toTranslate(validator.url(values.get('url'), false))
  errors.email = ErrorList.toTranslate(validator.email(values.get('email'), false))
  errors.company = ErrorList.toTranslate(validator.name(values.get('company'), false))
  return errors
}

export default ProfileModel
