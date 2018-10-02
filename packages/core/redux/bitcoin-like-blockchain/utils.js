/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import { TxEntryModel } from '../../models'

/**
 * Create new TxEntryModel from provided data
 * @param {Object} entry - TODO
 * @param {Object} options - TODO
 * @return {TxEntryModel}
 */
export const createBitcoinTxEntryModel = (entry, options = {}) => {
  return new TxEntryModel({
    key: uuid(),
    isSubmitted: true,
    isAccepted: false,
    walletDerivedPath: options.walletDerivedPath,
    symbol: options.symbol,
    ...entry,
  })
}

