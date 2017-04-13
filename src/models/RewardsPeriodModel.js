import {Record as record} from 'immutable'
import moment from 'moment'

class RewardsPeriodModel extends record({
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
    return (this.totalDeposit() / (timeTotalSupply / 100)) || 0
  }

  userDeposit () {
    return this.get('userDeposit')
  }

  userRevenue (assetBalance: number) {
    return ((assetBalance * this.userDeposit()) / this.totalDeposit()) || 0
  }

  userDepositPercent () {
    return (this.userDeposit() / (this.totalDeposit() / 100)) || 0
  }

  assetBalance () {
    return this.get('assetBalance') / 100
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
