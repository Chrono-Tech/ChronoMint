import BalanceModel from 'models/tokens/BalanceModel'
import MultisigWalletModel from 'models/wallet/MultisigWalletModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class MultisigWalletCollection extends abstractFetchingCollection({
  // defaults
}) {
  balance (walletId, balance: BalanceModel) {
    const wallet: MultisigWalletModel = this.item(walletId)
    const balances = wallet.balances().update(balance)
    return this.update(wallet.balances(balances))
  }
}
