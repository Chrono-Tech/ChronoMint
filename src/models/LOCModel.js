import { abstractFetchingModel } from './AbstractFetchingModel'
import { dateFormatOptions } from '../config'
import moment from 'moment'

export const THE_90_DAYS = 90 * 24 * 60 * 60 * 1000

export const STATUS_MAINTENANCE = 0
export const STATUS_ACTIVE = 1
export const STATUS_SUSPENDED = 2
export const STATUS_BANKRUPT = 3
export const STATUS_INACTIVE = 4

class LOCModel extends abstractFetchingModel({
  name: '',
  oldName: '', // for update logic
  website: '',
  issued: 0,
  issueLimit: 0,
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  createDate: Date.now(),
  status: 0,
  securityPercentage: 0,
  // TODO @dkchv: update this with token symbol
  currency: 'LHT',
  isPending: true,
  isFailed: false, // for dryrun
  isNew: true
}) {
  name (value) {
    return value === undefined ? this.get('name') : this.set('name', value)
  }

  oldName (value) {
    return value === undefined ? this.get('oldName') : this.set('oldName', value)
  }

  issueLimit () {
    return this.get('issueLimit')
  }

  issued (value) {
    return value === undefined ? this.get('issued') : this.set('issued', value)
  }

  expDate () {
    return this.get('expDate')
  }

  expDateString () {
    return new Date(this.expDate()).toLocaleDateString('en-us', dateFormatOptions)
  }

  createDate () {
    return this.get('createDate')
  }

  createDateString () {
    return new Date(this.createDate()).toLocaleDateString('en-us', dateFormatOptions)
  }

  daysLeft () {
    return this.isActive() ? moment(this.expDate()).diff(Date.now(), 'days') : 0
  }

  status () {
    return this.isNotExpired() ? this.get('status') : STATUS_INACTIVE // inactive
  }

  currency () {
    return this.get('currency')
  }

  publishedHash () {
    return this.get('publishedHash')
  }

  isPending (value) {
    if (value === undefined) {
      return this.get('isPending')
    } else {
      return this.set('isFailed', false).set('isPending', value)
    }
  }

  isFailed (value) {
    if (value === undefined) {
      return this.get('isFailed')
    } else {
      return this.set('isFailed', value).set('isPending', false)
    }
  }

  isNew () {
    return this.get('isNew')
  }

  isNotExpired () {
    return this.expDate() > Date.now()
  }

  isActive () {
    return this.isNotExpired() && this.get('status') === STATUS_ACTIVE
  }

  toFormJS () {
    return {
      ...super.toJS(),
      expDate: new Date(this.get('expDate'))
    }
  }
}

export default LOCModel
