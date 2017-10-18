import { abstractFetchingModel } from './AbstractFetchingModel'
import { dateFormatOptions } from '../config'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { I18n } from 'react-redux-i18n'

export const THE_90_DAYS = 90 * 24 * 60 * 60 * 1000

export const STATUS_MAINTENANCE = 0
export const STATUS_ACTIVE = 1
export const STATUS_SUSPENDED = 2
export const STATUS_BANKRUPT = 3
export const STATUS_INACTIVE = 4

const statusesMeta = {
  [STATUS_MAINTENANCE]: {
    token: 'locs.status.maintenance',
    styleName: 'maintenance',
  },
  [STATUS_ACTIVE]: {
    token: 'locs.status.active',
    styleName: 'active',
  },
  [STATUS_SUSPENDED]: {
    token: 'locs.status.suspended',
    styleName: 'suspended',
  },
  [STATUS_BANKRUPT]: {
    token: 'locs.status.bankrupt',
    styleName: 'bankrupt',
  },
  [STATUS_INACTIVE]: {
    token: 'locs.status.inactive',
    styleName: 'inactive',
  },
}

class LOCModel extends abstractFetchingModel({
  name: '',
  oldName: '', // for update logic
  website: '',
  issued: new BigNumber(0),
  issueLimit: new BigNumber(0),
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  createDate: Date.now(),
  status: 0,
  securityPercentage: 0,
  isPending: true,
  isFailed: false, // for dryrun
  isNew: true,
  token: null,
}) {
  name(value) {
    return value === undefined ? this.get('name') : this.set('name', value)
  }

  website() {
    return this.get('website')
  }

  oldName(value) {
    return value === undefined ? this.get('oldName') : this.set('oldName', value)
  }

  issueLimit() {
    return this.get('issueLimit')
  }

  issued(value: BigNumber): BigNumber {
    return value === undefined ? this.get('issued') : this.set('issued', value)
  }

  expDate() {
    return this.get('expDate')
  }

  expDateString() {
    return new Date(this.expDate()).toLocaleDateString('en-us', dateFormatOptions)
  }

  createDate() {
    return this.get('createDate')
  }

  createDateString() {
    return new Date(this.createDate()).toLocaleDateString('en-us', dateFormatOptions)
  }

  daysLeft() {
    return this.isActive() ? moment(this.expDate()).diff(Date.now(), 'days') : 0
  }

  status() {
    return this.isNotExpired() ? this.get('status') : STATUS_INACTIVE // inactive
  }

  statusString(status) {
    const statusId = status === undefined ? this.status() : status
    return I18n.t(statusesMeta[statusId].token)
  }

  statusStyle() {
    return statusesMeta[this.status()].styleName
  }

  currency() {
    return this.get('token').symbol()
  }

  token(value) {
    return (value === undefined) ? this.get('token') : this.set('token', value)
  }

  publishedHash() {
    return this.get('publishedHash')
  }

  isPending(value) {
    if (value === undefined) {
      return this.get('isPending')
    }
    return this.set('isFailed', false).set('isPending', value)
  }

  isFailed(value) {
    if (value === undefined) {
      return this.get('isFailed')
    }
    return this.set('isFailed', value).set('isPending', false)
  }

  isNew() {
    return this.get('isNew')
  }

  isNotExpired() {
    return this.expDate() > Date.now()
  }

  isActive() {
    return this.isNotExpired() && this.get('status') === STATUS_ACTIVE
  }

  toFormJS() {
    return {
      name: this.name(),
      website: this.website(),
      expDate: new Date(this.get('expDate')),
      issueLimit: this.issueLimit(),
      publishedHash: this.publishedHash(),
    }
  }
}

export default LOCModel
