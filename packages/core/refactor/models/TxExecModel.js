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
  args: PropTypes.object,
  value: PropTypes.instanceOf(BigNumber),
  gas: PropTypes.instanceOf(BigNumber),
  isGasUsed: PropTypes.bool,
  estimateGasLaxity: PropTypes.instanceOf(BigNumber),
  hash: PropTypes.string,
  params: PropTypes.object,
  gasLimit: PropTypes.instanceOf(BigNumber),
  gasPrice: PropTypes.instanceOf(BigNumber),
  options: PropTypes.object,
  data: PropTypes.string,
})

export default class TxExecModel extends AbstractModel {
  constructor (props) {
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get from () {
    return this.args.from
  }

  get to () {
    return this.args.to
  }
}
