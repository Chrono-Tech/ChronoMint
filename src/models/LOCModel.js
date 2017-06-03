import { abstractFetchingModel } from './AbstractFetchingModel'
import { LHT_INDEX } from '../dao/TokenContractsDAO'
import { dateFormatOptions } from '../config'

const THE_90_DAYS = 90 * 24 * 60 * 64 * 1000

const currencies = [
  'ETH',
  'TIME',
  'LHT'
]

class LOCModel extends abstractFetchingModel({
  id: null,
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

  issued () {
    return this.get('issued')
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

  status () {
    return this.get('status')
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
      expDate: new Date(this.get('expDate')),
      createDate: new Date(this.get('createDate'))
    }
  }
}

export default LOCModel
