import {Map, Record as record} from 'immutable'

class RewardsModel extends record({
  address: null,
  periodLength: null,
  lastPeriod: null,
  lastClosedPeriod: null,
  accountDeposit: null,
  accountRewards: null,
  timeTotalSupply: null,
  currentAccumulated: null,
  periods: new Map() /** @see RewardsPeriodModel */
}) {
  periodLength () {
    return this.get('periodLength')
  }

  lastPeriodIndex () {
    return this.lastPeriod + 1
  }

  accountDeposit () {
    return this.get('accountDeposit')
  }

  accountRewards () {
    return this.get('accountRewards') / 100
  }

  currentAccumulated () {
    return this.get('currentAccumulated') / 100
  }

  timeTotalSupply () {
    return this.get('timeTotalSupply')
  }
}

export default RewardsModel
