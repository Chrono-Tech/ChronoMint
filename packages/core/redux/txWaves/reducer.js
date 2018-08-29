/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesTxActions from './constants'

const initialState = () => ({
  status: {
    http: {
      url: '',
      ready: false,
      connecting: false,
    },
    ws: {
      url: '',
      ready: false,
      connecting: false,
    },
  },
  transactionsHistory: [],
  newTransaction: {},
})

const mutations = {

  [WavesTxActions.WAVES_ENGINE_RESET_ALL]: () => initialState(),
  // [WavesTxActions.WAVES_ENGINE_RESET_HTTP]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_RESET_WS]: (state) => initialState(),

  // [WavesTxActions.WAVES_ENGINE_HTTP_RECONNECT]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_HTTP_RECONNECT_SUCCESS]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_HTTP_RECONNECT_FAILURE]: (state) => initialState(),

  // [WavesTxActions.WAVES_ENGINE_WS_RECONNECT]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_WS_RECONNECT_SUCCESS]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_WS_RECONNECT_FAILURE]: (state) => initialState(),

  // [WavesTxActions.WAVES_ENGINE_PREPARE_NEW_TRANSACTION]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_PREPARE_NEW_TRANSACTION_SUCCESS]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_PREPARE_NEW_TRANSACTION_FAILURE]: (state) => initialState(),

  // [WavesTxActions.WAVES_ENGINE_SIGN_NEW_TRANSACTION]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_SIGN_NEW_TRANSACTION_SUCCESS]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_SIGN_NEW_TRANSACTION_FAILURE]: (state) => initialState(),

  // [WavesTxActions.WAVES_ENGINE_SEND_NEW_TRANSACTION]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_SEND_NEW_TRANSACTION_SUCCESS]: (state) => initialState(),
  // [WavesTxActions.WAVES_ENGINE_SEND_NEW_TRANSACTION_FAILURE]: (state) => initialState(),

  [WavesTxActions.WAVES_TX_CREATE]: (state, txEntry) => ({
    ...state,
    ...txEntry,
  }),

  [WavesTxActions.WAVES_TX_RESET]: () => ({}),

  [WavesTxActions.WAVES_TX_STATUS]: (state, payload) => ({
    ...state,
    ...payload,
  }),

  [WavesTxActions.WAVES_TX_UPDATE]: (state, payload) => ({
    ...state,
    ...payload,
  }),
}

export default (state = initialState(), { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
