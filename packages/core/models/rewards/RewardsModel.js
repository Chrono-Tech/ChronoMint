/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Map } from 'immutable'
import Amount from '../Amount'
import AssetsCollection from '../assetHolder/AssetsCollection'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class RewardsModel extends abstractFetchingModel({
  address: null,
  symbol: 'DEPRECATED',
  periodLength: null,
  lastPeriod: null,
  lastClosedPeriod: null,
  accountRewards: new Amount(0, null, false),
  // currentAccumulated: new Amount(0, null, false),
  rewardsLeft: new Amount(0, null, false),
  periods: new Map(), /** @see RewardsPeriodModel */
  assets: new AssetsCollection(),
}) {
  id () {
    return this.address()
  }

  address (value) {
    return this._getSet('address', value)
  }

  /**
   * @deprecated
   */
  symbol () {
    return this.get('symbol')
  }

  periods () {
    return this.get('periods')
  }

  periodLength () {
    return this.get('periodLength')
  }

  lastPeriodIndex () {
    return this.lastPeriod + 1
  }

  accountRewards (): Amount {
    return this.get('accountRewards')
  }

  // currentAccumulated (): Amount {
  //   return this.get('currentAccumulated')
  // }

  rewardsLeft (value) {
    return this._getSet('rewardsLeft', value)
  }

  assets (value) {
    return this._getSet('assets', value)
  }
}
