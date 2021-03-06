/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import { WALLET_TYPE_MEMORY } from '../../../models/constants/AccountEntryModel'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  key: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  encrypted: PropTypes.array,
  profile: PropTypes.object,
  blockchainList: PropTypes.arrayOf(PropTypes.string),
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
      blockchainList: [],
    }, props)
  }

  get address () {
    return this.encrypted[0].address
  }

  isMemoryWallet () {
    return !this.type || this.type === WALLET_TYPE_MEMORY
  }
}

export default AccountEntryModel
