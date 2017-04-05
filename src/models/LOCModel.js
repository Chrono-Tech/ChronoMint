import {Record as record} from 'immutable'

class LOCModel extends record({
  address: null,
  hasConfirmed: null,
  locName: null,
  website: null,
  controller: null,
  issueLimit: 0,
  issued: 0,
  redeemed: 0,
  publishedHash: null,
  expDate: new Date().getTime() + 7776000000,
  status: 0
}) {
  getAddress () {
    return this.get('address')
  }

  name () {
    return this.get('locName') ? this.get('locName') : this.get('address')
  }

  issueLimit () {
    return this.get('issueLimit')
  }

  issued () {
    return this.get('issued')
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
}

export default LOCModel
