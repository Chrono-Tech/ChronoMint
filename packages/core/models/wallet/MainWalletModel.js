/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Map } from 'immutable'
import BalanceModel from '../tokens/BalanceModel'
import BalancesCollection from '../tokens/BalancesCollection'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import AllowanceCollection from './AllowanceCollection'
import TransactionsCollection from './TransactionsCollection'
import AddressesCollection from './AddressesCollection'

export default class MainWalletModel extends abstractFetchingModel({
  address: null,
  tokens: new Map(),
  timeAddress: null,
  isMultisig: false,
  isMainWallet: true,
  // TODO @dkchv: is a part of wallet ?
  isTIMERequired: true,
  balances: new BalancesCollection(),
  allowances: new AllowanceCollection(),
  transactions: new Map(),
  addresses: new AddressesCollection(),
  names: new Map(),
  web3: null,
}) {

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

  getAllPendingTransactions () {
    let pendingTransactions = []
    const addresses = []
    this.addresses().items().map((a) => {
      addresses.push(a.address())
    })

    this.get('transactions').map((t, e) => {
      const [, transactionAddress] = e.split('-')
      if (!addresses.includes(transactionAddress)) {
        return
      }
      pendingTransactions = pendingTransactions.concat(t.items().filter((tr) => {
        return tr.blockNumber() === -1 || tr.blockNumber() === null
      }))
    })

    return pendingTransactions
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

  isDerived () {
    return false
  }
}

