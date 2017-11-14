import BigNumber from 'bignumber.js'
import Immutable from 'immutable'
import { abstractModel } from './AbstractModel'

class RewardsModel extends abstractModel({
  address: null,
  symbol: null,
  periodLength: null,
  lastPeriod: null,
  lastClosedPeriod: null,
  accountDeposit: new BigNumber(0),
  accountRewards: new BigNumber(0),
  timeTotalSupply: new BigNumber(0),
  currentAccumulated: new BigNumber(0),
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

  accountDeposit (): BigNumber {
    return this.get('accountDeposit')
  }

  accountRewards (): BigNumber {
    return this.get('accountRewards')
  }

  currentAccumulated (): BigNumber {
    return this.get('currentAccumulated')
  }

  timeTotalSupply (): BigNumber {
    return this.get('timeTotalSupply')
  }
}

export default RewardsModel
