/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import uuid from 'uuid/v1'
import TxEntryModel from '../../models/TxEntryModel'
import TxExecModel from '../../models/TxExecModel'

// eslint-disable-next-line import/prefer-default-export
export const createTxEntry = (tx) => new TxEntryModel({
  feeMultiplier: tx.feeMultiplier,
  isAccepted: false,
  isSubmitted: false,
  key: uuid(),
  tx: new TxExecModel(tx),
  walletDerivedPath: tx.walletDerivedPath,
})
