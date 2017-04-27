import { Record as record } from 'immutable'
import * as validation from '../components/forms/validate'

class LOCModel extends record({
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
  isFetching: false,
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

  isFetching () {
    return this.get('isFetching')
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

  errors.locName = validation.name(values.get('locName'))
  errors.publishedHash = validation.required(values.get('publishedHash'))
  errors.website = validation.url(values.get('website'))
  errors.issueLimit = validation.positiveInt(values.get('issueLimit'))

  return errors
}

export default LOCModel
