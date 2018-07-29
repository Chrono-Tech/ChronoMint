/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import PropTypes from 'prop-types'
import AbstractModel from '../../models/AbstractModel'
import Amount from '../Amount'
import TxHistoryModel from './TxHistoryModel'
import AllowanceCollection from '../../models/AllowanceCollection'
import MultisigWalletPendingTxModel from './MultisigWalletPendingTxModel'
import MultisigWalletPendingTxCollection from './MultisigWalletPendingTxCollection'

const schemaFactory = () => ({
  address: PropTypes.string.isRequired,
  blockchain: PropTypes.string.isRequired,
  name: PropTypes.string,
  balances: PropTypes.object,
  transactions: PropTypes.instanceOf(TxHistoryModel),
  owners: PropTypes.arrayOf(PropTypes.string),
  requiredSignatures: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pendingTxList: PropTypes.instanceOf(MultisigWalletPendingTxCollection),
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
  pendingTxList: new MultisigWalletPendingTxCollection({}),
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

  updatePendingTx (PendingTx: MultisigWalletPendingTxModel) {
    return new MultisigEthWalletModel({
      ...this,
      pendingTxList: this.pendingTxList.update(PendingTx),
    })
  }

  // forms

  toAddFormJS () {
    const time = this.releaseTime.getTime() === 0 ? new Date() : this.releaseTime

    return {
      requiredSignatures: this.requiredSignatures,
      owners: this.owners,
      timeLockDate: time,
      timeLockTime: time,
    }
  }

  toCreateWalletTx () {
    if (this.is2FA) {
      return {}
    }

    const data = {
      requiredSignatures: {
        value: this.requiredSignatures,
        description: 'requiredSignatures',
      },
      owners: {
        value: this.owners,
        description: 'owners',
      },
    }

    if (this.isTimeLocked) {
      data.releaseTime = {
        value: this.releaseTime,
        description: 'releaseTime',
      }
      data.isTimeLocked = {
        value: true,
        description: 'isTimeLocked',
      }
    }

    return data
  }

  toRequiredSignaturesFormJS () {
    return {
      ownersCount: this.owners,
      requiredSignatures: this.requiredSignatures,
    }
  }

  transform () {
    return { ...this }
  }
}
