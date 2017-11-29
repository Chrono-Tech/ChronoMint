import BigNumber from 'bignumber.js'
import { abstractModel } from '../AbstractModel'

class MultisigTransactionModel extends abstractModel({
  id: null, // operation hash
  owner: null,
  wallet: null,
  symbol: null,
  value: new BigNumber(0),
}) {
  id () {
    return this.get('id') || Math.random()
  }

  value () {
    return this.get('value')
  }

  symbol () {
    return this.get('symbol')
  }

  wallet () {
    return this.get('wallet')
  }
}

export default MultisigTransactionModel
