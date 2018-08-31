/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import AssetModel from './AssetModel'

export default class AssetsCollection extends abstractFetchingCollection({
  emptyModel: new AssetModel(),
}) {

}
