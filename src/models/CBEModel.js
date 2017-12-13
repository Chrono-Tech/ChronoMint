import ErrorList from 'platform/ErrorList'
import validator from 'models/validator'
import { abstractFetchingModel } from './AbstractFetchingModel'
import ProfileModel from './ProfileModel'

class CBEModel extends abstractFetchingModel({
  address: null,
  name: null,
  user: null,
}) {
  constructor (data = {}) {
    super({
      ...data,
      user: data.user instanceof ProfileModel ? data.user : new ProfileModel(data.user),
    })
  }

  address () {
    return this.get('address')
  }

  id () {
    return this.address()
  }

  // TODO @ipavlenko: Proxy to user().name(), remove name from constructor
  name () {
    return this.get('name')
  }

  /** @returns {ProfileModel} */
  user () {
    return this.get('user')
  }
}

export const validate = (values) => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  return errors
}

export default CBEModel
