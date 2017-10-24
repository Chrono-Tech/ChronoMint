import { abstractFetchingModel } from '../AbstractFetchingModel'
import BigNumber from 'bignumber.js'

class MultisigWalletPendingTxModel extends abstractFetchingModel({
  id: null, // operation hash
  initiator: null,
  symbol: null,
  to: null,
  value: new BigNumber(0)
}) {
  id () {
    return this.get('id')
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
}

export default MultisigWalletPendingTxModel
