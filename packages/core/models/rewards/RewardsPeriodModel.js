/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BigNumber from 'bignumber.js'
import Amount from '../Amount'
import moment from 'moment'
import { abstractFetchingModel } from '../AbstractFetchingModel'

class RewardsPeriodModel extends abstractFetchingModel({
  totalDeposit: new Amount(0, null, false),
  userDeposit: new Amount(0, null, false),
  isClosed: false,
  startDate: null,
  assetBalance: new Amount(0, null, false),
  uniqueShareholders: 0,
  periodLength: 0,
  accountRewards: new Amount(0, null, false),
}) {
  index () {
    return this.id() + 1
  }

  totalDeposit (): Amount {
    return this.get('totalDeposit')
  }

  totalDepositPercent (value: Amount): string {
    if (value.isZero()) {
      return 0
    }
    return this.totalDeposit().div(value.div(100))
  }

  userDeposit (): Amount {
    return this.get('userDeposit')
  }

  userDepositPercent (): string {
    const r = this.userDeposit().div(this.totalDeposit().div(100)).toString(10)
    return isNaN(r) ? '0' : r
  }

  userRevenue (): BigNumber {
    const assetBalance = this.assetBalance()
    if (this.totalDeposit().isZero()) {
      return new Amount(0, assetBalance.symbol())
    }
    return assetBalance.mul(this.userDeposit()).div(this.totalDeposit())
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

  progress () {
    if (this.periodLength() === 0) {
      return 100
    }
    return Math.round(100 * (this.daysPassed() / this.periodLength()))
  }
}

export default RewardsPeriodModel
