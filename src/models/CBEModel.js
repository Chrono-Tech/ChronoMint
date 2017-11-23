import validator from 'utils/validator'
import { ErrorList } from 'platform'

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
  // TODO @ipavlenko: Handle null in UI forms
  name () {
    return this.get('name') ? this.get('name') : null
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
