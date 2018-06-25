/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import OwnerModel from './OwnerModel'

export default class OwnerCollection extends abstractFetchingCollection({
  emptyModel: new OwnerModel(),
}) {

}
