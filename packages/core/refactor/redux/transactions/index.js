/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { BLOCKCHAIN_ETHEREUM } from '../../../dao/EthereumDAO'

export const getDataForConfirm = (tx) => createSelector(
  [],
  () => {
    switch (tx.blockchain) {
      case BLOCKCHAIN_ETHEREUM:
        break
      default:
        break
    }

    return {}
  },
)
