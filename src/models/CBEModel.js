import React from 'react'
import { abstractModel } from './AbstractModel'
import validator from '../components/forms/validator'
import ProfileModel from './ProfileModel'
import ErrorList from '../components/forms/ErrorList'

class CBEModel extends abstractModel({
  address: null,
  name: null,
  user: null,
  isFetching: false
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

  /** @return {ProfileModel} */
  user () {
    return this.get('user')
  }

  isFetching () {
    return this.get('isFetching')
  }

  fetching () {
    return this.set('isFetching', true)
  }
}

export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  return errors
}

export default CBEModel
