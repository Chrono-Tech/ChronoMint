import Immutable from 'immutable'

import { abstractFetchingModel } from './AbstractFetchingModel'

export const abstractFetchingCollection = (defaultValues) => class AbstractFetchingCollection extends abstractFetchingModel({
  list: new Immutable.Map(),
  selected: null,
  ...defaultValues,
}) {
  list (value) {
    return this._getSet('list', value)
  }

  add (item: abstractFetchingModel) {
    return this.list(this.list().set(item.id(), item))
  }

  // alias
  update (item) {
    return this.add(item)
  }

  remove (item: abstractFetchingModel) {
    return this.list(this.list().remove(item.id()))
  }

  items () {
    return this.list().valueSeq().toArray()
  }

  item (id) {
    return this.list().get(id)
  }

  selected (value) {
    if (value === undefined) {
      return this.list().get(this.get('selected'))
    } else {
      return this.set('selected', value)
    }
  }

  hasSelected () {
    return !!this.get('selected')
  }

  size () {
    return this.list().size
  }

  first () {
    return this.list().first()
  }
}

export default abstractFetchingCollection()
