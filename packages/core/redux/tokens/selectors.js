/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import {
  BCC,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  BTC,
  BTG,
  ETH,
  LTC,
  WAVES,
  XEM,
} from '../../dao/constants'

import { DUCK_TOKENS } from './constants'

export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}

export const isBTCLikeBlockchain = (blockchain) => {
  return [
    BLOCKCHAIN_BITCOIN,
    BLOCKCHAIN_BITCOIN_CASH,
    BLOCKCHAIN_BITCOIN_GOLD,
    BLOCKCHAIN_LITECOIN,
  ].includes(blockchain)
}

export const getMainSymbolForBlockchain = (blockchain) => {
  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
      return BTC
    case BLOCKCHAIN_BITCOIN_CASH:
      return BCC
    case BLOCKCHAIN_BITCOIN_GOLD:
      return BTG
    case BLOCKCHAIN_LITECOIN:
      return LTC
    case BLOCKCHAIN_ETHEREUM:
      return ETH
    case BLOCKCHAIN_NEM:
      return XEM
    case BLOCKCHAIN_WAVES:
      return WAVES
  }
}
export const getMainTokenForWalletByBlockchain = (blockchain) => createSelector(
  [getTokens],
  (tokens) => tokens.item(getMainSymbolForBlockchain(blockchain)),
)

export const getTokensForBlockchain = (blockchain) => createSelector(
  [getTokens],
  (tokens) => {
    return tokens
      .filter((token) => token.blockchain() === blockchain)
      .sortBy((token) => token.symbol())
      .toArray()
  },
)

export const makeGetLastBlockForBlockchain = (symbol) => {
  return createSelector(
    [
      getTokens,
    ],
    (
      tokens,
    ) => {
      if (!symbol) {
        return null
      }
      return tokens.latestBlocks()[tokens.item(symbol).blockchain()]
    },
  )
}
