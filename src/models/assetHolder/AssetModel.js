import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class AssetModel extends abstractFetchingModel({
  address: null,
  deposit: new Amount(0, null, false),
  symbol: null,
}) {
  id () {
    return this.get('address')
  }

  deposit (value) {
    return this._getSet('deposit', value)
  }

  symbol (value) {
    return this._getSet('symbol', value)
  }
}
