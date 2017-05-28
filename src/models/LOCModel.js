import { abstractFetchingModel } from './AbstractFetchingModel'

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

export const validateRules = {
  locName: 'required|min:3',
  publishedHash: 'required',
  website: 'url',
  issueLimit: 'positive-number'
}

export default LOCModel
