import Immutable from 'immutable'

import { abstractFetchingModel } from './AbstractFetchingModel'

export const abstractFetchingCollection = (defaultValues) => class AbstractFetchingCollection extends abstractFetchingModel({
  list: new Immutable.Map(),
  leftToFetch: 0,
  selected: null,
  emptyModel: null,
  ...defaultValues,
}) {
  list (value) {
    return this._getSet('list', value)
  }

  add (item) {
    return this.list(this.list().set(item.id(), item))
  }

  merge (items) {
    return this.list(this.list().merge(items))
  }

  // alias
  update (item) {
    return this.add(item)
  }

  remove (itemOrId) {
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id()
    return this.list(this.list().remove(id))
  }

  items () {
    return this.list().valueSeq().toArray()
  }

  sortBy (predicate) {
    return this.list().valueSeq().sortBy(predicate).toArray()
  }

  filter (predicate) {
    return this.list().valueSeq().filter(predicate)
  }

  item (id) {
    return this.list().get(id) || this.emptyModel()
  }

  leftToFetch (value) {
    if (value === undefined) {
      return this.get('leftToFetch')
    }
    const result = this.set('leftToFetch', value).isFetching(value > 0)
    return value === 0 && !this.isFetched()
      ? result.isFetched(true)
      : result
  }

  itemFetched (item) {
    item = item.isFetching ? item.isFetching(false) : item
    item = item.isFetched ? item.isFetched(true) : item
    const leftToFetch = Math.max(this.leftToFetch() - 1, 0)
    return this.add(item).leftToFetch(leftToFetch)
  }

  selected (value) {
    const currentSelectedItem = this.item(this.get('selected'))
    // getter
    if (value === undefined) {
      return currentSelectedItem
    }

    // setter
    let result = this.set('selected', value)
    const newSelectedItem = this.item(value)

    if (currentSelectedItem === newSelectedItem) {
      return result
    }
    // deselect previous
    if (currentSelectedItem) {
      result = result.update(currentSelectedItem.isSelected(false))
    }
    // select new one
    if (newSelectedItem) {
      result = result.update(newSelectedItem.isSelected(true))
    }
    return result
  }

  hasSelected () {
    return !!this.get('selected')
  }

  size () {
    return this.list().size
  }

  first (forceEmptyModel = false) {
    const item = this.list().first()
    if (!item && forceEmptyModel) {
      return this.emptyModel()
    }
    return item
  }

  emptyModel (value) {
    return this._getSet('emptyModel', value)
  }
}

export default abstractFetchingCollection()
