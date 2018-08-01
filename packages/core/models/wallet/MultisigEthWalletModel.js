/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../AbstractModelOld'
import Amount from '../Amount'
import TxHistoryModel from './TxHistoryModel'
import AllowanceCollection from '../AllowanceCollection'

const schemaFactory = () => ({
  address: PropTypes.string.isRequired,
  blockchain: PropTypes.string.isRequired,
  name: PropTypes.string,
  balances: PropTypes.object,
  transactions: PropTypes.instanceOf(TxHistoryModel),
  owners: PropTypes.arrayOf(PropTypes.string),
  requiredSignatures: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pendingTxList: PropTypes.object,
  releaseTime: PropTypes.instanceOf(Date),
  customTokens: PropTypes.object,
  deriveNumber: PropTypes.number,
  is2FA: PropTypes.bool,
  isMultisig: PropTypes.bool,
  amount: PropTypes.instanceOf(Amount),
  isTimeLocked: PropTypes.bool,
  isTIMERequired: PropTypes.bool,
  allowances: PropTypes.instanceOf(AllowanceCollection),
})

const defaultProps = {
  balances: {},
  transactions: new TxHistoryModel(),
  owners: [],
  pendingTxList: null,
  customTokens: null,
  isTIMERequired: false,
  allowances: new AllowanceCollection({}),
}

export default class MultisigEthWalletModel extends AbstractModel {
  constructor (ownProps) {
    const props = { ...defaultProps, ...ownProps }
    super(props, schemaFactory())
    Object.assign(this, props)
    Object.freeze(this)
  }

  get id () {
    return `${this.blockchain}-${this.address}`
  }

  updateBalance (balance: Amount) {
    return new MultisigEthWalletModel({
      ...this,
      balances: {
        ...this.balances,
        [balance.symbol()]: balance,
      },
    })
  }

  transform () {
    return { ...this }
  }
}
