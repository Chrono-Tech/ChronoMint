import React from 'react'
import { abstractFetchingModel } from './AbstractFetchingModel'
import * as validation from '../components/forms/validate'
import ProfileModel from './ProfileModel'

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
  errors.address = validation.address(values.get('address'))
  errors.name = validation.name(values.get('name'))
  return errors
}

export default CBEModel
