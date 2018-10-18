/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from './AbstractModel'
import Amount from './Amount'

const schemaFactory = () => ({
  id: PropTypes.string,
  value: PropTypes.instanceOf(Amount),
  contractAddress: PropTypes.string,
  withdrawTrader: PropTypes.string,
  secretLock: PropTypes.string,

})

export default class SwapModel extends AbstractModel {
  constructor (data, options) {
    super(Object.assign({
      isLoading: false,
      isLoaded: false,
    }, data), schemaFactory(), options)
    Object.freeze(this)
  }
}
