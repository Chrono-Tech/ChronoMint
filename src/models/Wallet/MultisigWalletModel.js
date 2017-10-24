import Immutable from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'
import ls from 'utils/LocalStorage'

export default class MultisigWalletModel extends abstractFetchingModel({
  address: null, //
  tokens: null, //
  isMultisig: true, //
  owners: new Immutable.List(ls.getAccount()),
  name: null,
  requiredSignatures: null,
  dao: null,
  pendingTxList: new Immutable.List()
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
      owners: this.owners().toArray()
    }
  }

  tokens () {
    return this.get('tokens')
  }

  isMultisig () {
    return this.get('isMultisig')
  }

  txSummary () {
    return {
      owners: this.owners(),
      requiredSignatures: this.requiredSignatures(),
      walletName: this.name()
    }
  }

  dao () {
    return this.get('dao')
  }
}

