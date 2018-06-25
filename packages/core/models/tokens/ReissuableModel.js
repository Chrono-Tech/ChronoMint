/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class ReissuableModel extends abstractFetchingModel({
  value: null,
}) {
  value (value) {
    return this._getSet('value', value)
  }
}
