/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import TokenModel from './TokenModel'

export default class TokensCollection extends abstractFetchingCollection({
  emptyModel: new TokenModel(),
}) {
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
