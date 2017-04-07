import {Record as record} from 'immutable'
import moment from 'moment'

class RewardsPeriodModel extends record({
  id: null,
  totalDeposit: null,
  currentUserDeposit: null,
  isClosed: false,
  startDate: null,
  assetBalance: null,
  uniqueShareholders: null,
  periodLength: null
}) {
  getIndex () {
    return this.id
  }

  getId () {
    return this.id + 1
  }

  getTotalDeposit () {
    return this.totalDeposit
  }

  getTotalDepositPercent (timeTotalSupply: number) {
    return (this.getTotalDeposit() / (timeTotalSupply / 100)) || 0
  }

  getUserDeposit () {
    return this.currentUserDeposit
  }

  getUserRevenue (assetBalance: number) {
    return ((assetBalance * this.getUserDeposit()) / this.getTotalDeposit()) || 0
  }

  getUserDepositPercent () {
    return (this.getUserDeposit() / (this.getTotalDeposit() / 100)) || 0
  }

  getAssetBalance () {
    return this.assetBalance / 100
  }

  getUniqueShareholders () {
    return this.uniqueShareholders
  }

  getStartMoment () {
    return moment.unix(this.startDate)
  }

  getStartDate () {
    return this.startDate ? this.getStartMoment().format('Do MMMM YYYY') : ''
  }

  getEndMoment () {
    return this.getStartMoment().add(this.periodLength, 'days')
  }

  getEndDate () {
    return this.startDate ? this.getEndMoment().format('Do MMMM YYYY') : ''
  }

  getDaysRemaining () {
    const timeDiff = Math.abs(this.getEndMoment() - this.getStartMoment())
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  getDaysPassed () {
    return this.startDate ? moment().diff(this.getStartMoment(), 'days') : ''
  }

  isClosable () {
    return !this.isClosed && moment() > this.getEndMoment()
  }
}

export default RewardsPeriodModel
