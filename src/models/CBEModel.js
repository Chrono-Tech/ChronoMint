import React from 'react'
import { abstractModel } from './AbstractModel'
import * as validation from '../components/forms/validate'
import ProfileModel from './ProfileModel'

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
    return this.get('name') ? this.get('name') : <i>Unknown</i>
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
  errors.address = validation.address(values.get('address'))
  errors.name = validation.name(values.get('name'))
  return errors
}

export default CBEModel
