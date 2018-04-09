/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import AddressModel from 'models/wallet/AddressModel'
import { DUCK_MAIN_WALLET } from './actions'

export const getWallet = (state) => {
  return state.get(DUCK_MAIN_WALLET).addresses()
}

export const getTxsFromDuck = (state) => {
  const wallet = state.get(DUCK_MAIN_WALLET)
  return wallet.transactions()
}

export const getWalletAddress = (blockchain: string) => createSelector(
  [ getWallet ],
  (addresses) => {
    return blockchain ? addresses.item(blockchain) : new AddressModel()
  },
)

export const getTxs = () => createSelector(
  [ getTxsFromDuck ],
  (txs) => {
    return txs
  },
)
