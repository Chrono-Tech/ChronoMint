import React from 'react'
import {Record as record} from 'immutable'
import * as validation from '../components/forms/validate'
import UserModel from './UserModel'

class CBEModel extends record({
  address: null,
  name: null,
  user: null
}) {
  constructor (data = {}) {
    super({
      ...data,
      user: data.user instanceof UserModel ? data.user : new UserModel(data.user)
    })
  }

  address () {
    return this.get('address')
  };

  name () {
    return this.get('name') ? this.get('name') : <i>Unknown</i>
  }

  strName () {
    return this.get('name') ? this.get('name') : this.get('address')
  }

  /** @return {UserModel} */
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
