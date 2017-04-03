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
  getPeriodLength () {
    return this.get('periodLength')
  }

  lastPeriodIndex () {
    return this.lastPeriod + 1
  }

  getAccountDeposit () {
    return this.get('accountDeposit')
  }

  getAccountRewards () {
    return this.get('accountRewards')
  }

  getCurrentAccumulated () {
    return this.get('currentAccumulated')
  }

  getTimeTotalSupply () {
    return this.get('timeTotalSupply')
  }
}

export default RewardsModel
