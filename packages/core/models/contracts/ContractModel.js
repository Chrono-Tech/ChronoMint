/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModelOld'

const schemaFactory = () => ({
  type: PropTypes.string.isRequired,
  address: PropTypes.string,
  history: PropTypes.string,
  abi: PropTypes.object.isRequired,
  DAOClass: PropTypes.any,
})

export default class ContractModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  create (address = null, history = null) {
    console.log('create ContractModel: ', this.DAOClass)
    return new this.DAOClass({
      address: address || this.address,
      history: history || this.history,
      abi: this.abi,
    })
  }
}
