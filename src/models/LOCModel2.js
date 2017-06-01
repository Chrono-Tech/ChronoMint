import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'
import { LHT_INDEX } from '../dao/TokenContractsDAO'
import { dateFormatOptions } from '../config'

const THE_90_DAYS = 90 * 24 * 60 * 64 * 1000

let locsID = 0

function getNewID () {
  return ++locsID
}

class LOCModel extends abstractFetchingModel({
  id: null,
  name: '',
  oldName: '', // for update logic
  website: null,
  issued: 0,
  issueLimit: 0,
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  status: 0,
  securityPercentage: 0,
  // TODO @dkchv: update this
  currency: LHT_INDEX,
  isPending: true,
  isNew: true

  // TODO @dkchv: !!!!
  // hasConfirmed: null,
  // controller: null,
  // redeemed: 0,
  // isSubmitting: false,
  // isIssuing: false,
  // isRedeeming: false
}) {
  constructor (data) {
    super({
      id: getNewID(),
      ...data
    })
  }

  id () {
    return this.get('id')
  }

  name (value) {
    return value === undefined ? this.get('name') : this.set('name', value)
  }

  oldName () {
    return this.get('newName')
  }

  issueLimit () {
    return this.get('issueLimit')
  }

  issued () {
    return this.get('issued')
  }

  // redeemed () {
  //   return this.get('redeemed')
  // }

  expDate () {
    return this.get('expDate')
  }

  expDateString () {
    return new Date(this.expDate()).toLocaleDateString('en-us', dateFormatOptions)
  }

  status () {
    return this.get('status')
  }

  // isSubmitting () {
  //   return this.get('isSubmitting')
  // }

  // isIssuing () {
  //   return this.get('isIssuing')
  // }

  // isRedeeming () {
  //   return this.get('isRedeeming')
  // }

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
    const {id, name, website, publishedHash, expDate, issueLimit, status, isNew} = super.toJS()
    return {
      id,
      name,
      website,
      publishedHash,
      expDate: new Date(expDate),
      issueLimit,
      status,
      isNew
    }
  }
}

export const validate = values => {
  const errors = {}
  errors.name = ErrorList.toTranslate(validator.name(values.get('name')))
  errors.publishedHash = ErrorList.toTranslate(validator.required(values.get('publishedHash')))
  errors.website = ErrorList.toTranslate(validator.url(values.get('website')))
  errors.issueLimit = ErrorList.toTranslate(validator.positiveInt(values.get('issueLimit')))

  return errors
}

export default LOCModel
