import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

class LOCModel extends abstractFetchingModel({
  address: null,
  hasConfirmed: null,
  locName: null,
  website: null,
  controller: null,
  issueLimit: 0,
  issued: 0,
  redeemed: 0,
  publishedHash: '',
  expDate: new Date().getTime() + 7776000000,
  status: 0,
  isSubmitting: false,
  isIssuing: false,
  isRedeeming: false
}) {
  getAddress () {
    return this.get('address')
  }

  name () {
    return this.get('locName') ? this.get('locName') : this.get('address')
  }

  issueLimit () {
    return this.get('issueLimit') / 100000000
  }

  issued () {
    return this.get('issued') / 100000000
  }

  redeemed () {
    return this.get('redeemed')
  }

  expDate () {
    return this.get('expDate')
  }

  status () {
    return this.get('status')
  }

  isSubmitting () {
    return this.get('isSubmitting')
  }

  isIssuing () {
    return this.get('isIssuing')
  }

  isRedeeming () {
    return this.get('isRedeeming')
  }

  publishedHash () {
    return this.get('publishedHash')
  }
}

export const validate = values => {
  const errors = {}
  errors.locName = ErrorList.toTranslate(validator.name(values.get('locName')))
  errors.publishedHash = ErrorList.toTranslate(validator.required(values.get('publishedHash')))
  errors.website = ErrorList.toTranslate(validator.url(values.get('website')))
  errors.issueLimit = ErrorList.toTranslate(validator.positiveInt(values.get('issueLimit')))

  return errors
}

export default LOCModel
