/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import type MultisigWalletPendingTxModel from './MultisigWalletPendingTxModel'
import MultisigEthLikeWalletModel from './MultisigEthLikeWalletModel'
import Amount from '../Amount'

export default class MultisigWalletCollection extends abstractFetchingCollection({
  twoFAConfirmed: true,
  web3: null,
}) {
  twoFAConfirmed (value) {
    return this._getSet('twoFAConfirmed', value)
  }

  balance (walletId, balance: Amount) {
    const wallet: MultisigEthLikeWalletModel = this.item(walletId)
    return this.update(wallet.updateBalance(balance))
  }

  allPendingsCount () {
    return this.list().reduce((memo, item: MultisigEthLikeWalletModel) => memo + item.pendingCount(), 0)
  }

  pending (walletId, pending: MultisigWalletPendingTxModel) {
    const wallet: MultisigEthLikeWalletModel = this.item(walletId)
    return this.update(wallet.updatePendingTx(pending))
  }

  activeWallets () {
    return this.filter((item) => !item.isTimeLocked()).toArray()
  }

  timeLockedWallets () {
    return this.filter((item) => item.isTimeLocked()).toArray()
  }
}
