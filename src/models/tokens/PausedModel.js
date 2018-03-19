import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class PausedModel extends abstractFetchingModel({
  value: null,
}) {
  value (value) {
    return this._getSet('value', value)
  }
}
