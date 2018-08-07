/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'

class AbstractAccountModel {
  constructor (props, schema){
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }
}

export default AbstractAccountModel
