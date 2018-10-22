/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  BLOCKCHAIN_ETHEREUM,
} from '@chronobank/login/network/constants'
import { BLOCKCHAINS_LIST_UPDATE, DEFAULT_ACTIVE_WALLETS_LIST } from './constants'

const initialState = {
  list: [ BLOCKCHAIN_ETHEREUM ].concat(DEFAULT_ACTIVE_WALLETS_LIST),
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
