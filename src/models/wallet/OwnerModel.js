import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class OwnerModel extends abstractFetchingModel({
  address: null,
}) {
  id () {
    return this.address()
  }

  address (value) {
    return this._getSet('address', value)
  }
}
