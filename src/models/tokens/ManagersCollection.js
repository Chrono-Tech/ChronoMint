import Immutable from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class ManagersCollection extends abstractFetchingModel({
  managersList: new Immutable.Map(),
}) {
  list (value) {
    return this._getSet('managersList', value)
  }

  add (item) {
    return this.list(this.list().set(item, item))
  }

  size () {
    return this.list().size
  }

  items () {
    return this.list().valueSeq().toArray()
  }
}
