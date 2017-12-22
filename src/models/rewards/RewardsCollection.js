import AssetsCollection from 'models/assetHolder/AssetsCollection'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import RewardsPeriodModel from './RewardsPeriodModel'

export default class RewardsCollection extends abstractFetchingCollection({
  emptyModel: new RewardsPeriodModel(),
  address: null,
  currentPeriod: new RewardsPeriodModel(),
  assets: new AssetsCollection(),
  lastPeriod: 0,
}) {
  address (value) {
    return this._getSet('address', value)
  }

  currentPeriod (value) {
    return this._getSet('currentPeriod', value)
  }

  assets (value) {
    return this._getSet('assets', value)
  }

  lastPeriod () {
    return this.get('lastPeriod')
  }

  lastPeriodIndex () {
    return this.lastPeriod() + 1
  }
}
