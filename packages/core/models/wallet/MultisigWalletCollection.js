/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import type MultisigWalletPendingTxModel from './MultisigWalletPendingTxModel'
import MultisigEthWalletModel from './MultisigEthWalletModel'
import Amount from '../Amount'

export default class MultisigWalletCollection extends abstractFetchingCollection({
  twoFAConfirmed: true,
  web3: null,
}) {
  twoFAConfirmed (value) {
    return this._getSet('twoFAConfirmed', value)
  }

  balance (walletId, balance: Amount) {
    const wallet: MultisigEthWalletModel = this.item(walletId)
    return this.update(wallet.updateBalance(balance))
  }

  allPendingsCount () {
    return this.list().reduce((memo, item: MultisigEthWalletModel) => memo + item.pendingCount(), 0)
  }

  pending (walletId, pending: MultisigWalletPendingTxModel) {
    const wallet: MultisigEthWalletModel = this.item(walletId)
    return this.update(wallet.updatePendingTx(pending))
  }

  activeWallets () {
    return this.filter((item) => !item.isTimeLocked()).toArray()
  }

  timeLockedWallets () {
    return this.filter((item) => item.isTimeLocked()).toArray()
  }
}
