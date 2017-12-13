import Immutable from 'immutable'
import BalancesCollection from 'models/tokens/BalancesCollection'
import MultisigWalletPendingTxCollection from 'models/wallet/MultisigWalletPendingTxCollection'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class MultisigWalletModel extends abstractFetchingModel({
  address: null, //
  balances: new BalancesCollection(),
  tokens: new Immutable.Map(), //
  isMultisig: true, //
  transactions: new TransactionsCollection(),
  owners: new Immutable.List(),
  // TODO @dkchv: update functional
  name: 'No name',
  requiredSignatures: null,
  pendingTxList: new MultisigWalletPendingTxCollection(),
  is2FA: false,
}) {
  constructor (data = {}) {
    super({
      ...data,
      owners: new Immutable.List(data.owners),
    })
  }

  id () {
    return this.get('transactionHash') || this.get('address')
  }

  owners () {
    return this.get('owners')
  }

  ownersArray () {
    return this.owners().toArray()
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

  name () {
    return this.get('name')
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
      owners: this.owners(),
      requiredSignatures: this.requiredSignatures(),
      walletName: this.name(),
    }
  }

  toAddEditFormJS () {
    return {
      isNew: this.isNew(),
      name: this.name(),
      requiredSignatures: this.requiredSignatures(),
      owners: this.owners().map((address) => ({ address })),
    }
  }

  toCreateWalletTx () {
    return {
      requiredSignatures: this.requiredSignatures(),
      owners: this.ownersArray(),
    }
  }
}
