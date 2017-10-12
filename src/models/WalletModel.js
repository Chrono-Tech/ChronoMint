import Immutable from 'immutable'
import { abstractFetchingModel } from './AbstractFetchingModel'
import ls from 'utils/LocalStorage'

class WalletModel extends abstractFetchingModel({
  address: null,
  owners: new Immutable.List(ls.getAccount()),
  name: null,
  requiredSignatures: null,
  dao: null,
  pendingTxList: new Immutable.List(),
  tokens: null
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

export default WalletModel
