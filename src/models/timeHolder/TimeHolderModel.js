import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class TimeHolderModel extends abstractFetchingModel({
  timeAddress: null,
  timeHolderAddress: null,
  timeHolderWalletAddress: null,
  allowance: new Amount(),
}) {
  timeAddress (value) {
    return this._getSet('timeAddress', value)
  }

  timeHolderAddress (value) {
    return this._getSet('timeHolderAddress', value)
  }

  timeHolderWalletAddress (value) {
    return this._getSet('timeHolderWalletAddress', value)
  }
}
