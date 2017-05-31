import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

const THE_90_DAYS = 90 * 24 * 60 * 64 * 1000

class LOCModel extends abstractFetchingModel({
  name: null,
  website: null,
  issued: 0,
  issueLimit: 0,
  publishedHash: '',
  expDate: Date.now() + THE_90_DAYS,
  status: 0,
  securityPercentage: 0

  // TODO @dkchv: !!!!
  // hasConfirmed: null,
  // controller: null,
  // redeemed: 0,
  // isSubmitting: false,
  // isIssuing: false,
  // isRedeeming: false
}) {
  name () {
    return this.get('name')
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
