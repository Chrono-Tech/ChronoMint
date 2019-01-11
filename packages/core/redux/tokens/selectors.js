/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import {
  BCC,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
  BLOCKCHAIN_LITECOIN,
  BLOCKCHAIN_NEM,
  BLOCKCHAIN_WAVES,
  BLOCKCHAIN_EOS,
  BTC,
  DASH,
  ETH,
  LHT,
  LTC,
  WAVES,
  XEM,
} from '../../dao/constants'

import { DUCK_TOKENS } from './constants'
import { EOS } from '../eos/constants'
import { getEOSTokens } from '../eos/selectors/mainSelectors'
import TokensCollection from '../../models/tokens/TokensCollection'

export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}

export const getAllTokens = createSelector(
  [getTokens, getEOSTokens],
  (tokens, eosTokens) => {
    return new TokensCollection({
      list: tokens.list().merge(eosTokens.list()),
    })
  },
)

export const isBTCLikeBlockchain = (blockchain) => {
  return [
    BLOCKCHAIN_BITCOIN,
    BLOCKCHAIN_BITCOIN_CASH,
    BLOCKCHAIN_DASH,
    BLOCKCHAIN_LITECOIN,
  ].includes(blockchain)
}

export const getMainSymbolForBlockchain = (blockchain) => {
  switch (blockchain) {
    case BLOCKCHAIN_BITCOIN:
      return BTC
    case BLOCKCHAIN_BITCOIN_CASH:
      return BCC
    case BLOCKCHAIN_LITECOIN:
      return LTC
    case BLOCKCHAIN_DASH:
      return DASH
    case BLOCKCHAIN_ETHEREUM:
      return ETH
    case BLOCKCHAIN_LABOR_HOUR:
      return LHT
    case BLOCKCHAIN_NEM:
      return XEM
    case BLOCKCHAIN_WAVES:
      return WAVES
    case BLOCKCHAIN_EOS:
      return EOS
  }
}

export const getToken = (tokenId: string) => createSelector(
  [getTokens],
  (tokens) => tokens.item(tokenId),
)

export const getMainTokenForWalletByBlockchain = (blockchain) => createSelector(
  [getAllTokens],
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
