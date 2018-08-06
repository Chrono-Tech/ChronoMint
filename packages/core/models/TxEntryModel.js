/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import TxExecModel from './TxExecModel'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  key: PropTypes.string.isRequired,
  tx: PropTypes.instanceOf(TxExecModel).isRequired,
  // desc: PropTypes.instanceOf(TxDescModel),
  hash: PropTypes.string,
  raw: PropTypes.string,
  receipt: PropTypes.object,
  isSubmitted: PropTypes.bool,
  isPending: PropTypes.bool,
  isAccepted: PropTypes.bool,
  isRejected: PropTypes.bool,
  isSigned: PropTypes.bool,
  isSent: PropTypes.bool,
  isErrored: PropTypes.bool,
  isMined: PropTypes.bool,
})

export default class TxEntryModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
