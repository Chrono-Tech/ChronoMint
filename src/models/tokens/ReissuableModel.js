import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class ReissuableModel extends abstractFetchingModel({
  isReissuable: null,
}) {
  isReissuable (value) {
    return this._getSet('isReissuable', value)
  }

}