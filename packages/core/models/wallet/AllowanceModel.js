/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingModel } from '../AbstractFetchingModel'
import Amount from '../Amount'

export default class AllowanceModel extends abstractFetchingModel({
  amount: new Amount(0, null, false),
  spender: null, //address
  token: null, // id
}) {
  id () {
    // double key
    return `${this.get('spender')}-${this.get('token')}`
  }

  amount (value) {
    return this._getSet('amount', value)
  }
}
