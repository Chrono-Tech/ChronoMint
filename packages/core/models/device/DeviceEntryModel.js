/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModel'

const schema = {
  address: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
  publicKey: PropTypes.array,
}

class DeviceEntryModel extends AbstractModel {
  constructor (props) {
    super(props, schema)
    Object.assign(this, {
      address: '',
      path: '',
      publicKey: '',
      type: '',
    }, props)
    Object.freeze(this)
  }

}

export default DeviceEntryModel
