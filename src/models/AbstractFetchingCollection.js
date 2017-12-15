import Immutable from 'immutable'

import { abstractFetchingModel } from './AbstractFetchingModel'

export const abstractFetchingCollection = (defaultValues) => class AbstractFetchingCollection extends abstractFetchingModel({
  list: new Immutable.Map(),
  leftToFetch: 0,
  selected: null,
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

  remove (item) {
    return this.list(this.list().remove(item.id()))
  }

  items () {
    return this.list().valueSeq().toArray()
  }

  item (id) {
    const item = this.list().get(id)
    return !item && this.get('model')
      ? this.get('model')
      : item
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

    console.log('--AbstractFetchingCollection#selected', 1, value,  currentSelectedItem, newSelectedItem)

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
    console.log('--AbstractFetchingCollection#selected', 2, result)
    return result
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
