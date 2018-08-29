/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { TX_UPDATE } from './constants'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '../../dao/constants'

const initialSubState = { pending: {} }

const initialState = () => ({
  [BLOCKCHAIN_BITCOIN]: {
    ...initialSubState,
  },
  [BLOCKCHAIN_BITCOIN_CASH]: {
    ...initialSubState,
  },
  [BLOCKCHAIN_BITCOIN_GOLD]: {
    ...initialSubState,
  },
  [BLOCKCHAIN_LITECOIN]: {
    ...initialSubState,
  },
})

const mutations = {
  [TX_UPDATE] (state, { entry }) {
    const address = entry.tx.from
    const blockchainScope = state[entry.blockchain]
    const pending = blockchainScope.pending
    const scope = pending[address]
    return {
      ...state,
      [entry.blockchain]: {
        ...blockchainScope,
        pending: {
          ...pending,
          [address]: {
            ...scope,
            [entry.key]: entry,
          },
        },
      },
    }
  },
}

export default (state = initialState(), { type, ...other }) => {
  // return [state, other]
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
