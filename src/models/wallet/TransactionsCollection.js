/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TxModel from 'models/TxModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export const TXS_PER_PAGE = 100

export default class TransactionsCollection extends abstractFetchingCollection({
  endOfList: false,
  offset: null,
  emptyModel: new TxModel(),
}) {
  endOfList (value) {
    return this._getSet('endOfList', value)
  }

  offset (value) {
    return this._getSet('offset', value)
  }
}
