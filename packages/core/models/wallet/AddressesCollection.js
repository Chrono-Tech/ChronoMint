/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import AddressModel from './AddressModel'

export default class AddressesCollection extends abstractFetchingCollection({
  emptyModel: new AddressModel(),
}) {
}
