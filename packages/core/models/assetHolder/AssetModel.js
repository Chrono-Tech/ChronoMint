/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import Amount from '../Amount'
import { abstractFetchingModel } from '../AbstractFetchingModel'

export default class AssetModel extends abstractFetchingModel({
  address: null,
  deposit: new Amount(0, null, false),
  symbol: null,
}) {
  id () {
    return this.get('address')
  }

  deposit (value) {
    return this._getSet('deposit', value)
  }

  symbol (value) {
    if (value === undefined) {
      return this.get('symbol')
    }

    return this.deposit(this.deposit().symbol(value)).set('symbol', value)
  }
}
