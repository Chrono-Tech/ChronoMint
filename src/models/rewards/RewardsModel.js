import Immutable from 'immutable'
import Amount from 'models/Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class RewardsModel extends abstractFetchingModel({
  address: null,
  symbol: null,
  periodLength: null,
  lastPeriod: null,
  lastClosedPeriod: null,
  accountDeposit: new Amount(0, null, false),
  accountRewards: new Amount(0, null, false),
  timeTotalSupply: new Amount(0, null, false),
  currentAccumulated: new Amount(0, null, false),
  periods: new Immutable.Map(), /** @see RewardsPeriodModel */
}) {
  address () {
    return this.get('address')
  }

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

  accountDeposit (): Amount {
    return this.get('accountDeposit')
  }

  accountRewards (): Amount {
    return this.get('accountRewards')
  }

  currentAccumulated (): Amount {
    return this.get('currentAccumulated')
  }

  timeTotalSupply (): Amount {
    return this.get('timeTotalSupply')
  }
}
