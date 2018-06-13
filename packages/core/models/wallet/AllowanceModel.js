/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '../Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

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
