/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import BalanceModel from './BalanceModel'

export default class BalancesCollection extends abstractFetchingCollection({
  emptyModel: new BalanceModel(),
}) {

}
