/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Map } from 'immutable'

import { abstractFetchingModel } from './AbstractFetchingModel'

export const abstractFetchingCollection = (defaultValues) => class AbstractFetchingCollection extends abstractFetchingModel({
  list: new Map(),
  leftToFetch: 0,
  selected: null,
  emptyModel: null,
  ...defaultValues,
}) {
  list (value) {
    return this._getSet('list', value)
  }

  add (item) {
    const id = typeof item.id === 'function' ? item.id() : item.id
    return this.list(this.list().set(id, item))
  }

  merge (items) {
    return this.list(this.list().merge(items))
  }

  // alias
  update (item) {
    return this.add(item)
  }

  remove (itemOrId) {
    let result = this
    const id = typeof itemOrId === 'string' ? itemOrId : itemOrId.id()
    if (this.hasSelected() && this.selected().id() === id) {
      // reselect
      const firstNotSelected = result.filter((item) => item.id() !== id).first()
      result = result.selected(firstNotSelected ? firstNotSelected.id() : null)
    }
    return result.list(result.list().remove(id))
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
    const leftToFetch = Math.max(this.leftToFetch() - 1, 0)
    return this.add(item).leftToFetch(leftToFetch)
  }

  selected (id) {
    const currentSelectedItem = this.item(this.get('selected'))
    // getter
    if (id === undefined) {
      return currentSelectedItem
    }

    // setter
    let result = this.set('selected', id)
    const newSelectedItem = this.item(id)

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
