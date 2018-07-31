/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import PropTypes from 'prop-types'
import TxExecModel from '../TxExecModel'
import AbstractModel from '../../models/AbstractModel'

const schemaFactory = () => ({
  id: PropTypes.string,
  initiator: PropTypes.string,
  to: PropTypes.string,
  value: PropTypes.instanceOf(BigNumber),
  isConfirmed: PropTypes.bool,
  decodedTx: PropTypes.instanceOf(TxExecModel), // decoded data
})

const defaultValues = {
  id: null, // operation hash
  initiator: null,
  to: null,
  value: new BigNumber(0),
  isConfirmed: false,
  decodedTx: new TxExecModel(), // decoded data
}

export default class MultisigWalletPendingTxModel extends AbstractModel {
  constructor (props) {
    props = {
      ...defaultValues,
      ...props,
    }
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  txRevokeSummary () {
    return {
      transaction: this.id,
    }
  }

  title () {
    return this.decodedTx.title()
  }

  details () {
    return this.decodedTx.details()
  }
}
