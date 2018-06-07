/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_BITCOIN_CASH, BLOCKCHAIN_BITCOIN_GOLD, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'
import { BLOCKCHAIN_WAVES } from 'dao/WavesDAO'

import { DUCK_TOKENS } from './actions'
import { BCC, BTC, BTG, ETH, LTC, XEM, WAVES } from '../mainWallet/actions'

export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}

export const getMainTokenForWalletByBlockchain = (blockchain) => createSelector(
  [getTokens],
  (tokens) => {
    switch (blockchain) {
      case BLOCKCHAIN_BITCOIN:
        return tokens.item(BTC)
      case BLOCKCHAIN_BITCOIN_CASH:
        return tokens.item(BCC)
      case BLOCKCHAIN_BITCOIN_GOLD:
        return tokens.item(BTG)
      case BLOCKCHAIN_LITECOIN:
        return tokens.item(LTC)
      case BLOCKCHAIN_ETHEREUM:
        return tokens.item(ETH)
      case BLOCKCHAIN_NEM:
        return tokens.item(XEM)
      case BLOCKCHAIN_WAVES:
        return tokens.item(WAVES)
    }
  },
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
