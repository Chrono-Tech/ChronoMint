import { abstractFetchingModel } from '../AbstractFetchingModel'
import BigNumber from 'bignumber.js'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  symbol: null,
  to: null,
  value: new BigNumber(0),
  isConfirmed: false,
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

  symbol () {
    return this.get('symbol')
  }

  isConfirmed (value: boolean) {
    return this._getSet('isConfirmed', value)
  }

  txRevokeSummary () {
    return {
      to: this.to(),
      value: this.value(),
      symbol: this.symbol(),
    }
  }
}

export default MultisigWalletPendingTxModel
