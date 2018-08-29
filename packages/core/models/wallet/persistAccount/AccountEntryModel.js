/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  encrypted: PropTypes.array,
  profile: PropTypes.object,
}

class AccountEntryModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      key: '',
      name: '',
      type: '',
      encrypted: [],
      profile: null,
    }, props)
    Object.freeze(this)
  }

  get address () {
    switch (this.type) {
      case 'memory':
        return this.encrypted[0].address
      case 'device':
        return this.encrypted[0].address 
    }
  } 

  isMemoryWallet () {
    return !this.type || this.type === 'memory'
  }
}

export default AccountEntryModel
