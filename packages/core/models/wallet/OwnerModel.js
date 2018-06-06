/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class OwnerModel extends abstractFetchingModel({
  address: null,
}) {
  id () {
    return this.address()
  }

  address (value) {
    return this._getSet('address', value)
  }
}
