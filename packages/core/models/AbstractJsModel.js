/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'

export default class AbstractJsModel {
  constructor (props, schema) {
    PropTypes.checkPropTypes(schema, props, 'prop', '' + this.class)
    Object.assign(this, props)
  }
}
