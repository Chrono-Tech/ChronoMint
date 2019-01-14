/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import BalanceModel from './BalanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class BalancesCollection extends abstractFetchingCollection({
  emptyModel: new BalanceModel(),
}) {

}
