import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class AddressModel extends abstractFetchingModel({
  address: null,
}) {
  address (value) {
    return this._getSet('address', value)
  }
}
