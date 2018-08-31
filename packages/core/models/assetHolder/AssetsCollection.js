/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import AssetModel from './AssetModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class AssetsCollection extends abstractFetchingCollection({
  emptyModel: new AssetModel(),
}) {

}
