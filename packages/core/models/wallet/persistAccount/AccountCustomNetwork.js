/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractAccountModel from './AbstractAccountModel'

const schema = {
  id: PropTypes.string,
  name: PropTypes.string,
  url: PropTypes.string,
}

class AccountCustomNetwork extends AbstractAccountModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      id: '',
      name: '',
      url: '',
    }, props)
    Object.freeze(this)
  }
}

export default AccountCustomNetwork
