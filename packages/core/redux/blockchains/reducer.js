/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_DASH,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_LITECOIN,
} from '@chronobank/login/network/constants'
import { BLOCKCHAINS_LIST_UPDATE } from './constants'

const initialState = {
  list: [
    BLOCKCHAIN_ETHEREUM,
    BLOCKCHAIN_BITCOIN,
    BLOCKCHAIN_BITCOIN_CASH,
    BLOCKCHAIN_LITECOIN,
    BLOCKCHAIN_DASH,
  ],
}

const mutations = {
  [BLOCKCHAINS_LIST_UPDATE] (state, list) {
    return {
      ...state,
      list,
    }
  },
}

export default (state = initialState, { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
