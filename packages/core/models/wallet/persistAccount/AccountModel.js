/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountEntryModel from './AccountEntryModel'

const schema = {
  signers: PropTypes.instanceOf(Object),
  entry: PropTypes.instanceOf(AccountEntryModel),
}

class AccountModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }

  setSigner (type, signer) {
    this.signers[type] = signer
  }

  getSigner (type) {
    return this.signers[type] = signer
  }

}

export default AccountModel
