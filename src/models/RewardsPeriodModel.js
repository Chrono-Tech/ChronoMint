import BigNumber from 'bignumber.js'
import moment from 'moment'
import { abstractModel } from './AbstractModel'

class RewardsPeriodModel extends abstractModel({
  totalDeposit: new BigNumber(0),
  userDeposit: new BigNumber(0),
  isClosed: false,
  startDate: null,
  assetBalance: new BigNumber(0),
  uniqueShareholders: null,
  periodLength: null,
}) {
  index () {
    return this.id() + 1
  }

  totalDeposit (): BigNumber {
    return this.get('totalDeposit')
  }

  totalDepositPercent (timeTotalSupply: BigNumber): string {
    const r = this.totalDeposit().div(timeTotalSupply.div(100)).toString(10)
    return isNaN(r) ? '0' : r
  }

  userDeposit (): BigNumber {
    return this.get('userDeposit')
  }

  userDepositPercent (): string {
    const r = this.userDeposit().div(this.totalDeposit().div(100)).toString(10)
    return isNaN(r) ? '0' : r
  }

  userRevenue (totalDividends: BigNumber): BigNumber {
    const r = totalDividends.mul(this.userDeposit()).div(this.totalDeposit())
    return isNaN(r.toString(10)) ? new BigNumber(0) : r
  }

  assetBalance (): BigNumber {
    return this.get('assetBalance')
  }

  uniqueShareholders () {
    return this.get('uniqueShareholders')
  }

  periodLength () {
    return this.get('periodLength')
  }

  startMoment () {
    return moment.unix(this.get('startDate'))
  }

  startDate () {
    return this.startMoment()
  }

  endMoment () {
    return this.startMoment().add(this.periodLength(), 'days')
  }

  endDate () {
    return this.endMoment()
  }

  daysRemaining () {
    const diff = this.endMoment().diff(moment(), 'days')
    return diff >= 0 ? diff : 0
  }

  daysPassed () {
    return moment().diff(this.startMoment(), 'days')
  }

  isClosable () {
    return !this.get('isClosed') && moment().diff(this.endMoment(), 'seconds') >= 0
  }
}

export default RewardsPeriodModel
