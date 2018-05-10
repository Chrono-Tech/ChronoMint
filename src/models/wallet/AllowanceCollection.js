/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AllowanceModel from './AllowanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class AllowanceCollection extends abstractFetchingCollection({
  emptyModel: new AllowanceModel(),
}) {
  item (spender, tokenId) {
    return this.list().get(`${spender}-${tokenId}`) || this.emptyModel()
  }
}
