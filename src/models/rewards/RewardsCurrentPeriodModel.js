import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class RewardsCurrentPeriodModel extends abstractFetchingModel({
  id: 0, // period index
  periodLength: 0,
  rewards: new Amount(0, null, false),
}) {
  periodLength (value) {
    return this._getSet('periodLength', value)
  }

  rewards () {
    return this.get('rewards')
  }
}
