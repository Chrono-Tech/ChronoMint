/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  id: PropTypes.string,
  avatar: PropTypes.string,
  address: PropTypes.string,
  ipfsHash: PropTypes.string,
  userName: PropTypes.string,
}

export default class AccountProfileModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      id: '',
      avatar: '',
      address: '',
      ipfsHash: '',
      userName: '',
    }, props)
    Object.freeze(this)
  }
}
