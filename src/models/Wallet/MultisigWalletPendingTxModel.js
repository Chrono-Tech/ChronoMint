import { abstractFetchingModel } from '../AbstractFetchingModel'
import BigNumber from 'bignumber.js'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  symbol: null,
  to: null,
  value: new BigNumber(0),
  isSigned: false,
  isRevoked: false,
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

  isSigned (value: boolean) {
    if (value === undefined) {
      return this.get('isSigned')
    } else {
      return this.set('isRevoked', !value).set('isSigned', value)
    }
  }

  isRevoked (value: boolean) {
    if (value === undefined) {
      return this.get('isRevoked')
    } else {
      return this.set('isSigned', !value).set('isRevoked', value)
    }
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
