/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '../Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class RewardsCurrentPeriodModel extends abstractFetchingModel({
  id: 0, // period index
  periodLength: 0,
  rewards: new Amount(0, null, false),
}) {
  index () {
    return this.id() + 1
  }

  periodLength (value) {
    return this._getSet('periodLength', value)
  }

  rewards () {
    return this.get('rewards')
  }
}
