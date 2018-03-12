import Immutable from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class BlacklistModel extends abstractFetchingModel({
  list: new Immutable.List(),
}) {
  list (value) {
    return this._getSet('list', value)
  }

  add (item) {
    return this.list(this.list().push(item))
  }

  delete (value) {
    const newList = this.list().delete(this.list().keyOf(value))
    return this.list(newList)
  }
}
