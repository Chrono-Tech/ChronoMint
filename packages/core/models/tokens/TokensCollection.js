/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import TokenModel from './TokenModel'

export default class TokensCollection extends abstractFetchingCollection({
  emptyModel: new TokenModel(),
  latestBlocks: {},
}) {
  latestBlocks (value) {
    return this._getSet('latestBlocks', value)
  }

  getBySymbol (symbol: string) {
    let resultItem = this.get('emptyModel')
    this.items().some((item: TokenModel) => {
      if (item.symbol() === symbol) {
        resultItem = item
        return true
      }
    })
    return resultItem
  }

  getByAddress (address: string) {
    let resultItem = this.get('emptyModel')
    this.items().some((item: TokenModel) => {
      if (item.transactionHash() === address || item.address() === address) {
        resultItem = item
        return true
      }
    })
    return resultItem
  }
}
