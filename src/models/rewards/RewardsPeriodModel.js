import BigNumber from 'bignumber.js'
import Amount from 'models/Amount'
import moment from 'moment'
import { abstractModel } from '../AbstractModel'

class RewardsPeriodModel extends abstractModel({
  totalDeposit: new Amount(0, null, false),
  userDeposit: new Amount(0, null, false),
  isClosed: false,
  startDate: null,
  assetBalance: new Amount(0, null, false),
  uniqueShareholders: 0,
  periodLength: null,
  accountRewards: new Amount(0, null, false),
}) {
  index () {
    return this.id() + 1
  }

  totalDeposit (): Amount {
    return this.get('totalDeposit')
  }

  totalDepositPercent (value: Amount): string {
    const r = this.totalDeposit().div(value.div(100)).toString(10)
    return isNaN(r) ? '0' : r
  }

  userDeposit (): Amount {
    return this.get('userDeposit')
  }

  userDepositPercent (): string {
    const r = this.userDeposit().div(this.totalDeposit().div(100)).toString(10)
    return isNaN(r) ? '0' : r
  }

  userRevenue (value): BigNumber {
    const r = value.mul(this.userDeposit()).div(this.totalDeposit())
    return isNaN(r.toString(10)) ? new BigNumber(0) : r
  }

  assetBalance (): Amount {
    return this.get('assetBalance')
  }

  uniqueShareholders () {
    return this.get('uniqueShareholders')
  }

  periodLength () {
    return this.get('periodLength')
  }

  startDate (): moment {
    return moment.unix(this.get('startDate'))
  }

  endDate () {
    return this.startDate().add(this.periodLength(), 'days')
  }

  daysRemaining () {
    const diff = this.endDate().diff(moment(), 'days')
    return diff >= 0 ? diff : 0
  }

  daysPassed () {
    return moment().diff(this.startDate(), 'days')
  }

  isClosable () {
    return !this.get('isClosed') && moment().diff(this.endDate(), 'seconds') >= 0
  }

  accountRewards (value) {
    return this._getSet('accountRewards', value)
  }
}

export default RewardsPeriodModel