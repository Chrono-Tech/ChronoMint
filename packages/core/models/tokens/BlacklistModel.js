/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { List } from 'immutable'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class BlacklistModel extends abstractFetchingModel({
  list: new List(),
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
