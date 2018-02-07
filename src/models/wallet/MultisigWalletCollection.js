import BalanceModel from 'models/tokens/BalanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import MultisigWalletModel from './MultisigWalletModel'
import type MultisigWalletPendingTxModel from './MultisigWalletPendingTxModel'

export default class MultisigWalletCollection extends abstractFetchingCollection({
  // defaults
}) {
  balance (walletId, balance: BalanceModel) {
    const wallet: MultisigWalletModel = this.item(walletId)
    const balances = wallet.balances().itemFetched(balance)
    return this.update(wallet.balances(balances))
  }

  allPendingsCount () {
    return this.list().reduce((memo, item: MultisigWalletModel) => memo + item.pendingCount(), 0)
  }

  pending (walletId, pending: MultisigWalletPendingTxModel) {
    const wallet: MultisigWalletModel = this.item(walletId)
    const updatedPending = wallet.pendingTxList().itemFetched(pending)
    return this.update(wallet.pendingTxList(updatedPending))
  }

  activeWallets () {
    return this.filter((item) => !item.isTimeLocked()).toArray()
  }

  timeLockedWallets () {
    return this.filter((item) => item.isTimeLocked()).toArray()
  }
}
