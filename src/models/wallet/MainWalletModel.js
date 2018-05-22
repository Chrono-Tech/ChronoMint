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
  transactions: new TransactionsCollection(),
  addresses: new AddressesCollection(),
  names: new Immutable.Map(),
}) {

  address () {
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

  transactions (value) {
    return this._getSet('transactions', value)
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
