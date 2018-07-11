/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import AbstractModel from './AbstractModel'

const schemaFactory = () => ({
  contract: PropTypes.string,
  func: PropTypes.string,
  args: PropTypes.array,
  value: PropTypes.instanceOf(BigNumber),
  gas: PropTypes.instanceOf(BigNumber),
  hash: PropTypes.string,
  gasLimit: PropTypes.instanceOf(BigNumber),
  gasPrice: PropTypes.instanceOf(BigNumber),
  data: PropTypes.string,
  to: PropTypes.string,
  feeMultiplier: PropTypes.number,
})

export default class TxExecModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }
}
