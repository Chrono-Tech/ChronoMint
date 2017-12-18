import BigNumber from 'bignumber.js'
import { abstractFetchingModel } from '../AbstractFetchingModel'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  to: null,
  value: new BigNumber(0),
  isConfirmed: false,
  data: null,
}) {
  id () {
    return this.get('id') || Math.random()
  }

  to () {
    return this.get('to')
  }

  value () {
    return this.get('value')
  }

  isConfirmed (value: boolean) {
    return this._getSet('isConfirmed', value)
  }

  txRevokeSummary () {
    return {
      to: this.to(),
      value: this.value(),
    }
  }
}

export default MultisigWalletPendingTxModel
