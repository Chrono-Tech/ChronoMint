/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../../refactor/models/AbstractModel'
import Amount from '../Amount'

const schemaFactory = () => ({
  address: PropTypes.string.isRequired,
  blockchain: PropTypes.string.isRequired,
  name: PropTypes.string,
  balances: PropTypes.object,
  transactions: PropTypes.object,
  owners: PropTypes.arrayOf(PropTypes.string),
  requiredSignatures: PropTypes.number,
  pendingTxList: PropTypes.object,
  releaseTime: PropTypes.instanceOf(Date),
  customTokens: PropTypes.object,
  deriveNumber: PropTypes.number,
  is2FA: PropTypes.bool,
  isMultisig: PropTypes.bool,
  amount: PropTypes.instanceOf(Amount),
  isTimeLocked: PropTypes.bool,
})

const defaultProps = {
  balances: {},
  transactions: {},
  owners: [],
  pendingTxList: null,
  customTokens: null,
}

export default class WalletModel extends AbstractModel {
  constructor (ownProps) {
    const props = { ...defaultProps, ...ownProps }
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get id () {
    return `${this.blockchain}-${this.address}`
  }

  transform () {
    return { ...this }
  }
}
