/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createSelector } from 'reselect'
import { BLOCKCHAIN_BITCOIN, BLOCKCHAIN_BITCOIN_CASH, BLOCKCHAIN_BITCOIN_GOLD, BLOCKCHAIN_LITECOIN } from '@chronobank/login/network/BitcoinProvider'
import { BLOCKCHAIN_ETHEREUM } from 'dao/EthereumDAO'
import { BLOCKCHAIN_NEM } from 'dao/NemDAO'

import { DUCK_TOKENS } from './actions'
import { BCC, BTC, BTG, ETH, LTC, XEM } from '../mainWallet/actions'

export const getTokens = (state) => {
  return state.get(DUCK_TOKENS)
}

export const getTokenForWalletByBlockchain = (blockchain) => createSelector(
  [ getTokens ],
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
    }
  },
)
