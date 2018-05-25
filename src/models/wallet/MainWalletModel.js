/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Immutable from 'immutable'
import BalanceModel from 'models/tokens/BalanceModel'
import BalancesCollection from 'models/tokens/BalancesCollection'
import ls from 'utils/LocalStorage'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import AllowanceCollection from './AllowanceCollection'
import TransactionsCollection from './TransactionsCollection'
import AddressesCollection from './AddressesCollection'

export default class MainWalletModel extends abstractFetchingModel({
  address: null,
  tokens: new Immutable.Map(),
  timeAddress: null,
  isMultisig: false,
  isMainWallet: true,
  // TODO @dkchv: is a part of wallet ?
  isTIMERequired: true,
  balances: new BalancesCollection(),
  allowances: new AllowanceCollection(),
  transactions: new Immutable.Map(),
  addresses: new AddressesCollection(),
  names: new Immutable.Map(),
}) {

  address () {
    console.log('ls get account = ' + ls.getAccount())
    return ls.getAccount()
  }

  addresses (value) {
    return this._getSet('addresses', value)
  }

  /**
   * @deprecated
   */
  tokens (value) {
    return this._getSet('tokens', value)
  }

  names (value) {
    return this._getSet('names', value)
  }

  name (blockchain, address) {
    return this.get('names').get(`${blockchain}-${address}`)
  }

  transactions ({ blockchain, address }) {
    return this.get('transactions').get(`${blockchain}-${address}`) || new TransactionsCollection()
  }

  updateTransactionsGroup ({ blockchain, address, group }) {
    return this.set('transactions', this.get('transactions').set(`${blockchain}-${address}`, group))
  }

  setTransaction (tx) {
    const txGroupFrom = this.transactions({ blockchain: tx.blockchain(), address: tx.from() })
    const txGroupTo = this.transactions({ blockchain: tx.blockchain(), address: tx.to() })
    return this
      .updateTransactionsGroup({ blockchain: tx.blockchain(), address: tx.from(), group: txGroupFrom.add(tx) })
      .updateTransactionsGroup({ blockchain: tx.blockchain(), address: tx.to(), group: txGroupTo.add(tx) })
  }

  isTIMERequired (value) {
    return this._getSet('isTIMERequired', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  balances (value) {
    return this._getSet('balances', value)
  }

  balance (balance: BalanceModel) {
    return this.balances(this.balances().update(balance))
  }

  allowances (value) {
    return this._getSet('allowances', value)
  }

  isTimeLocked () {
    return false
  }
}
