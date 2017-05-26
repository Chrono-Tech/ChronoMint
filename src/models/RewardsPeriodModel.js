import { abstractModel } from './AbstractModel'
import moment from 'moment'

class RewardsPeriodModel extends abstractModel({
  id: null,
  totalDeposit: null,
  userDeposit: null,
  isClosed: false,
  startDate: null,
  assetBalance: null,
  uniqueShareholders: null,
  periodLength: null
}) {
  id () {
    return this.get('id')
  }

  index () {
    return this.id() + 1
  }

  totalDeposit () {
    return this.get('totalDeposit')
  }

  totalDepositPercent (timeTotalSupply: number) {
    const r = this.totalDeposit() / (timeTotalSupply / 100)
    return r === Infinity ? 0 : r
  }

  userDeposit () {
    return this.get('userDeposit')
  }

  userRevenue (assetBalance: number) {
    const r = (assetBalance * this.userDeposit()) / this.totalDeposit()
    return r === Infinity ? 0 : r
  }

  userDepositPercent () {
    const r = this.userDeposit() / (this.totalDeposit() / 100)
    return r === Infinity ? 0 : r
  }

  assetBalance () {
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
    return this.startMoment().format('Do MMMM YYYY')
  }

  endMoment () {
    return this.startMoment().add(this.periodLength(), 'days')
  }

  endDate () {
    return this.endMoment().format('Do MMMM YYYY')
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
