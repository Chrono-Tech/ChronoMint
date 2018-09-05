/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as BtcConstants from './constants'
import {
  BLOCKCHAIN_BITCOIN,
  BLOCKCHAIN_BITCOIN_CASH,
  BLOCKCHAIN_BITCOIN_GOLD,
  BLOCKCHAIN_LITECOIN,
} from '../../dao/constants'

const initialSubState = {
  // This field 'lastRequestMeta' is using only for logging purposes yet.
  // To be replaced with real state to provide info into UI.
  lastRequestMeta: null,
  pending: {},
}

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

  // GET UTXOS
  [BtcConstants.BITCOIN_HTTP_GET_UTXOS]: (state) => state,
  [BtcConstants.BITCOIN_HTTP_GET_UTXOS_SUCCESS]: (state, data) => ({
    ...state,
    lastRequestMeta: data,
  }),
  [BtcConstants.BITCOIN_HTTP_GET_UTXOS_FAILURE]: (state, error) => ({
    ...state,
    lastRequestMeta: error,
  }),

  // GET blocks height
  [BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT]: (state) => state,
  [BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT_SUCCESS]: (state, data) => ({
    ...state,
    lastRequestMeta: data,
  }),
  [BtcConstants.BITCOIN_HTTP_GET_BLOCKS_HEIGHT_FAILURE]: (state, error) => ({
    ...state,
    lastRequestMeta: error,
  }),

  // GET transaction info
  [BtcConstants.BITCOIN_HTTP_GET_TX_INFO]: (state) => state,
  [BtcConstants.BITCOIN_HTTP_GET_TX_INFO_SUCCESS]: (state, data) => ({
    ...state,
    lastRequestMeta: data,
  }),
  [BtcConstants.BITCOIN_HTTP_GET_TX_INFO_FAILURE]: (state, error) => ({
    ...state,
    lastRequestMeta: error,
  }),

  // GET address info
  [BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO]: (state) => state,
  [BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO_SUCCESS]: (state, data) => ({
    ...state,
    lastRequestMeta: data,
  }),
  [BtcConstants.BITCOIN_HTTP_GET_ADDRESS_INFO_FAILURE]: (state, error) => ({
    ...state,
    lastRequestMeta: error,
  }),

  // POST send transaction
  [BtcConstants.BITCOIN_HTTP_POST_SEND_TX]: (state) => state,
  [BtcConstants.BITCOIN_HTTP_POST_SEND_TX_SUCCESS]: (state, data) => ({
    ...state,
    lastRequestMeta: data,
  }),
  [BtcConstants.BITCOIN_HTTP_POST_SEND_TX_FAILURE]: (state, error) => ({
    ...state,
    lastRequestMeta: error,
  }),

  // Update/Create Tx in state
  [BtcConstants.BITCOIN_TX_UPDATE]: (state, { entry }) => {
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

  // Accept Tx in state
  [BtcConstants.BITCOIN_TX_ACCEPT]: (state, { entry }) => {
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

  // Reject Tx in state
  [BtcConstants.BITCOIN_TX_REJECT]: (state, { entry }) => {
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
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
