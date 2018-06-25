/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import AllowanceModel from './AllowanceModel'

export default class AllowanceCollection extends abstractFetchingCollection({
  emptyModel: new AllowanceModel(),
}) {
  item (spender, tokenId) {
    return this.list().get(`${spender}-${tokenId}`) || this.emptyModel()
  }
}
