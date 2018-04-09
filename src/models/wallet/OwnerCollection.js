/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import OwnerModel from './OwnerModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class OwnerCollection extends abstractFetchingCollection({
  emptyModel: new OwnerModel(),
}) {

}
