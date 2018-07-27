/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BalancesCollection from '../tokens/BalancesCollection'
import AddressesCollection from './AddressesCollection'
import MultisigWalletPendingTxCollection from './MultisigWalletPendingTxCollection'
import TransactionsCollection from './TransactionsCollection'
import { BLOCKCHAIN_ETHEREUM } from '../../dao/EthereumDAO'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import OwnerCollection from './OwnerCollection'

export default class MultisigWalletModel extends abstractFetchingModel({
  name: null,
  address: null, //
  balances: new BalancesCollection(),
  tokens: new Immutable.Map(), //
  isMultisig: true, //
  transactions: new TransactionsCollection(),
  owners: new OwnerCollection(),
  requiredSignatures: 0,
  pendingTxList: new MultisigWalletPendingTxCollection(),
  is2FA: false,
  addresses: new AddressesCollection(),
  releaseTime: new Date(0),
}) {
  id () {
    return this.get('address')
  }

  name (value) {
    return this._getSet('name', value)
  }

  owners (value) {
    return this._getSet('owners', value)
  }

  // shortcut for eth-address
  address (value) {
    return this._getSet('address', value)
  }

  balances (value) {
    return this._getSet('balances', value)
  }

  isNew () {
    return !this.address()
  }

  requiredSignatures (value) {
    return this._getSet('requiredSignatures', value)
  }

  pendingTxList (value) {
    return this._getSet('pendingTxList', value)
  }

  pendingCount () {
    return this.pendingTxList().size()
  }

  /**
   * @deprecated
   */
  tokens (value) {
    return this._getSet('tokens', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  transactions () {
    return this.get('transactions')
  }

  txSummary () {
    return {
      owners: this.ownersArray(),
      requiredSignatures: this.requiredSignatures(),
    }
  }

  ownersArray () {
    return this.owners().items().map((items) => items.address())
  }

  isTimeLocked () {
    return this.releaseTime().getTime() >= Date.now()
  }

  releaseTime () {
    return this.get('releaseTime')
  }

  addresses (value) {
    return this._getSet('addresses', value)
  }

  // forms

  toAddFormJS () {
    const time = this.releaseTime().getTime() === 0 ? new Date() : this.releaseTime()

    return {
      requiredSignatures: this.requiredSignatures(),
      owners: this.ownersArray(),
      timeLockDate: time,
      timeLockTime: time,
    }
  }

  toCreateWalletTx () {
    if (this.is2FA()) {
      return {}
    }

    const data = {
      requiredSignatures: {
        value: this.requiredSignatures(),
        description: 'requiredSignatures',
      },
      owners: {
        value: this.ownersArray(),
        description: 'owners',
      },
    }

    if (this.isTimeLocked()) {
      data.releaseTime = {
        value: this.releaseTime(),
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
      ownersCount: this.owners().size(),
      requiredSignatures: this.requiredSignatures(),
    }
  }

  blockchain () {
    return BLOCKCHAIN_ETHEREUM
  }

  is2FA () {
    return this.get('is2FA')
  }

  isDerived () {
    return false
  }
}
