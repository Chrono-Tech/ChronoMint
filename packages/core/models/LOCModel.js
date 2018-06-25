/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { I18n } from '@chronobank/core-dependencies/i18n'
import BigNumber from 'bignumber.js'
import moment from 'moment'

import { abstractFetchingModel } from './AbstractFetchingModel'
import Amount from './Amount'
import { dateFormatOptions } from './constants'
import TokenModel from './tokens/TokenModel'

export const THE_90_DAYS = 90 * 24 * 60 * 60 * 1000

export const STATUS_MAINTENANCE = 0
export const STATUS_ACTIVE = 1
export const STATUS_SUSPENDED = 2
export const STATUS_BANKRUPT = 3
export const STATUS_INACTIVE = 4

const statusesMeta = {
  [ STATUS_MAINTENANCE ]: {
    token: 'locs.status.maintenance',
    styleName: 'maintenance',
  },
  [ STATUS_ACTIVE ]: {
    token: 'locs.status.active',
    styleName: 'active',
  },
  [ STATUS_SUSPENDED ]: {
    token: 'locs.status.suspended',
    styleName: 'suspended',
  },
  [ STATUS_BANKRUPT ]: {
    token: 'locs.status.bankrupt',
    styleName: 'bankrupt',
  },
  [ STATUS_INACTIVE ]: {
    token: 'locs.status.inactive',
    styleName: 'inactive',
  },
}

class LOCModel extends abstractFetchingModel({
  name: '',
  oldName: '', // for update logic
  website: '',
  issued: new Amount(0),
  issueLimit: new Amount(0),
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  createDate: Date.now(),
  status: 0,
  securityPercentage: 0,
  isNew: true,
  symbol: null,
}) {
  name (value) {
    return this._getSet('name', value)
  }

  website () {
    return this.get('website')
  }

  oldName (value) {
    return this._getSet('oldName', value)
  }

  issueLimit () {
    return this.get('issueLimit')
  }

  issued (value: BigNumber): BigNumber {
    return this._getSet('issued', value)
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
    return this.isNotExpired() ? this.get('status') : STATUS_INACTIVE
  }

  statusString (status) {
    const statusId = status === undefined ? this.status() : status
    return I18n.t(statusesMeta[ statusId ].token)
  }

  statusStyle () {
    return statusesMeta[ this.status() ].styleName
  }

  symbol (value) {
    return this._getSet('symbol', value)
  }

  currency () {
    return this.symbol()
  }

  publishedHash () {
    return this.get('publishedHash')
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

  toFormJS (token: TokenModel) {
    return {
      name: this.name(),
      website: this.website(),
      expDate: new Date(this.get('expDate')),
      issueLimit: token.removeDecimals(this.issueLimit()),
      publishedHash: this.publishedHash(),
    }
  }
}

export default LOCModel
