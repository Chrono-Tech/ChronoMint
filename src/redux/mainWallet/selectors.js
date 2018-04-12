/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import AddressModel from 'models/wallet/AddressModel'
import TransactionsCollection from 'models/wallet/TransactionsCollection'
import { DUCK_MAIN_WALLET } from './actions'
import { getAssetsFromAssetHolder } from '../assetsHolder/selectors'
import { getTokens } from '../tokens/selectors'

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

export const getTxs = (filter: Function) => createSelector(
  [ getTxsFromDuck ],
  (txs) => {
    let list = null
    if (filter) {
      list = txs.list().filter(filter)
      return new TransactionsCollection({ list, endOfList: txs.endOfList(), offset: txs.offset() })
    }
    return txs
  },
)

export const getDeposit = (tokenId) => createSelector(
  [ getAssetsFromAssetHolder, getTokens ],
  (assets, tokens) => {
    const token = tokens.item(tokenId)
    return assets.item(token.address()).deposit()
  },
)

