/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class ExchangesCollection extends abstractFetchingCollection({
  // defaults
}) {
  concat (collection: ExchangesCollection) {
    return this.list(this.list().concat(collection.list()))
  }
}
