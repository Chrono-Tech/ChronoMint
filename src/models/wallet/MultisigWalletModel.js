import Immutable from 'immutable'
import BalancesCollection from 'models/tokens/BalancesCollection'
import MultisigWalletPendingTxCollection from 'models/wallet/MultisigWalletPendingTxCollection'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import OwnerCollection from './OwnerCollection'

export default class MultisigWalletModel extends abstractFetchingModel({
  address: null, //
  balances: new BalancesCollection(),
  tokens: new Immutable.Map(), //
  isMultisig: true, //
  transactions: new TransactionsCollection(),
  owners: new OwnerCollection(),
  // owners: new Immutable.List(),
  requiredSignatures: 0,
  pendingTxList: new MultisigWalletPendingTxCollection(),
  is2FA: false,
}) {
  id () {
    return this.get('transactionHash') || this.get('address')
  }

  owners () {
    return this.get('owners')
  }

  address () {
    return this.get('address')
  }

  balances (value) {
    return this._getSet('balances', value)
  }

  isNew () {
    return !this.address()
  }

  requiredSignatures () {
    return this.get('requiredSignatures')
  }

  pendingTxList (value) {
    return this._getSet('pendingTxList', value)
  }

  pendingCount () {
    return this.pendingTxList().size()
  }

  tokens (value) {
    return this._getSet('tokens', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  transactions (value) {
    return this._getSet('transactions', value)
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

  toAddEditFormJS () {
    return {
      isNew: this.isNew(),
      requiredSignatures: this.requiredSignatures(),
      owners: this.ownersArray(),
    }
  }

  toCreateWalletTx () {
    return {
      requiredSignatures: this.requiredSignatures(),
      owners: this.ownersArray(),
    }
  }
}
