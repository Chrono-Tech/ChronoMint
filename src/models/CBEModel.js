import React from 'react'
import { abstractFetchingModel } from './AbstractFetchingModel'
import ProfileModel from './ProfileModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

class CBEModel extends abstractFetchingModel({
  address: null,
  name: null,
  user: null
}) {
  constructor (data = {}) {
    super({
      ...data,
      user: data.user instanceof ProfileModel ? data.user : new ProfileModel(data.user)
    })
  }

  address () {
    return this.get('address')
  }

  name () {
    return this.get('name') ? this.get('name') : <em>Unknown</em>
  }

  /** @returns {ProfileModel} */
  user () {
    return this.get('user')
  }
}

export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  return errors
}

export default CBEModel
