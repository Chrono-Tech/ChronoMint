/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import ContractModel from './ContractModel'
import AbstractModel from '../AbstractModelOld'

const schemaFactory = () => ({
  contract: PropTypes.instanceOf(ContractModel).isRequired,
  address: PropTypes.string.isRequired,
  history: PropTypes.string,
  dao: PropTypes.any.isRequired,
})

export default class ContractDAOModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
