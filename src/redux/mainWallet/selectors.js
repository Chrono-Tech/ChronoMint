/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { DUCK_MAIN_WALLET } from './actions'

export const getTxsFromDuck = (state) => {
  const wallet = state.get(DUCK_MAIN_WALLET)
  return wallet.transactions()
}

export const getTxs = () => createSelector(
  [ getTxsFromDuck ],
  (txs) => {
    return txs
  },
)
