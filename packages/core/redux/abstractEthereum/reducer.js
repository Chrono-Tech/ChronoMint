/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  NONCE_UPDATE,
} from './constants'

import {
  BLOCKCHAIN_ETHEREUM,
  BLOCKCHAIN_LABOR_HOUR,
} from '../../dao/constants'

const initialSubState = {
  nonces: {},
}

const initialState = () => ({
  [BLOCKCHAIN_ETHEREUM]: {
    ...initialSubState,
  },
  [BLOCKCHAIN_LABOR_HOUR]: {
    ...initialSubState,
  },
})

const mutations = {
  [NONCE_UPDATE]: (state, { address, blockchain, nonce }) => {
    const blockchainScope = state[blockchain]
    const nonces = blockchainScope.nonces

    return ({
      ...state,
      [blockchain]: {
        ...blockchainScope,
        nonces: {
          ...nonces,
          [address]: nonce,
        },
      },
    })
  },
}

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
