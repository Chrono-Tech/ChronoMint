/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { tokensCountBalanceSelector } from './balances'

export const multisigTokensCountSelector = (address: string) => createSelector(
  [
    tokensCountBalanceSelector(address),
  ],
  (
    balances,
  ) => {
    return balances.length
  },
)
