/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class AddressModel extends abstractFetchingModel({
  address: null,
}) {
  address (value) {
    return this._getSet('address', value)
  }
}
