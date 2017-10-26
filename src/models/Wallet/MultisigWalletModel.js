import Immutable from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import ls from 'utils/LocalStorage'
import TransactionsCollection from 'models/Wallet/TransactionsCollection'

export default class MultisigWalletModel extends abstractFetchingModel({
  address: null, //
  tokens: new Immutable.Map(), //
  isMultisig: true, //
  transactions: new TransactionsCollection(),
  owners: new Immutable.List(ls.getAccount()),
  // TODO @dkchv: update functional
  name: 'No name',
  requiredSignatures: null,
  dao: null,
  pendingTxList: new Immutable.List(),
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

  toFormJS () {
    return {
      isNew: this.isNew(),
      name: this.name(),
      requiredSignatures: this.requiredSignatures(),
      owners: this.owners().toArray(),
    }
  }

  tokens (value) {
    return this._getSet('tokens', value)
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  txSummary () {
    return {
      owners: this.owners(),
      requiredSignatures: this.requiredSignatures(),
      walletName: this.name(),
    }
  }

  dao () {
    return this.get('dao')
  }

  transactions (value) {
    return this._getSet('transactions', value)
  }
}
