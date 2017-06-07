import { abstractFetchingModel } from './AbstractFetchingModel'
import { dateFormatOptions } from '../config'
import moment from 'moment'

const THE_90_DAYS = 90 * 24 * 60 * 64 * 1000

// TODO @dkchv: remove this
export const LHT_INDEX = 2

const currencies = [
  'ETH',
  'TIME',
  'LHT'
]

export const STATUS_MAINTENANCE = 0
export const STATUS_ACTIVE = 1
export const STATUS_SUSPENDED = 2
export const STATUS_BANKRUPT = 3
export const STATUS_INACTIVE = 4

class LOCModel extends abstractFetchingModel({
  name: '',
  oldName: '', // for update logic
  website: null,
  issued: 0,
  issueLimit: 0,
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  createDate: Date.now(),
  status: 0,
  securityPercentage: 0,
  // TODO @dkchv: update this
  currency: LHT_INDEX,
  isPending: true,
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
    return this.isActive() ? this.get('status') : STATUS_INACTIVE // inactive
  }

  currency () {
    return this.get('currency')
  }

  currencyString () {
    return currencies[this.currency()]
  }

  publishedHash () {
    return this.get('publishedHash')
  }

  isPending (value) {
    return value === undefined ? this.get('isPending') : this.set('isPending', value)
  }

  isNew () {
    return this.get('isNew')
  }

  isActive () {
    return this.expDate() > Date.now()
  }

  toFormJS () {
    return {
      ...super.toJS(),
      expDate: new Date(this.get('expDate'))
    }
  }
}

export default LOCModel
