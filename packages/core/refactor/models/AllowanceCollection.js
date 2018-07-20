/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'
import AllowanceModel from '../../models/wallet/AllowanceModel'

const schemaFactory = () => ({
  key: PropTypes.string,
  isLoading: PropTypes.bool.required,
  isLoaded: PropTypes.bool.required,
  list: PropTypes.objectOf(PropTypes.instanceOf(AllowanceModel)),
})

export default class AllowanceCollection extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      key: uuid(),
      isLoading: false,
      isLoaded: false,
      list: {},
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }
}
