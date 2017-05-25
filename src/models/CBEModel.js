import React from 'react'
import { abstractFetchingModel } from './AbstractFetchingModel'
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

export const validateRules = {
  address: 'required|ethereum-address',
  name: 'required|min:3'
}

export default CBEModel
