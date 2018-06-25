/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import AssetsCollection from '../assetHolder/AssetsCollection'
import RewardsCurrentPeriodModel from './RewardsCurrentPeriodModel'
import RewardsPeriodModel from './RewardsPeriodModel'

export default class RewardsCollection extends abstractFetchingCollection({
  emptyModel: new RewardsPeriodModel(),
  address: null,
  currentPeriod: new RewardsCurrentPeriodModel(),
  assets: new AssetsCollection(),
  lastPeriod: 0,
  periodCount: 0,
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

  periodCount (value) {
    return this._getSet('periodCount', value)
  }

  currentIndex () {
    return this.size() + this.leftToFetch() + 1
  }
}
