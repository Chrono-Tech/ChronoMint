/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'
import AccountEntryModel from './AccountEntryModel'
import SignerModel from './SignerModel'

const schema = {
  signer: PropTypes.instanceOf(SignerModel),
  btcSigner: PropTypes.instanceOf(SignerModel),
  entry: PropTypes.instanceOf(AccountEntryModel),
}

class AccountModel extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, props)
    Object.freeze(this)
  }

  get signerLitecoin () {

  }

  get signerDesh () {

  }

  get signerWaves () {

  }

}

export default AccountModel
