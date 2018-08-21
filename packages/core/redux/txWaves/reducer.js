/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as WavesTxActions from './constants'

const initialState = () => ({
  pending: {},
})

const mutations = {
  [WavesTxActions.WAVES_TX_CREATE]: (state) => ({
    ...state,
  }),

  [WavesTxActions.WAVES_TX_RESET]: (state) => ({
    ...state,
    pending: {},
  }),

  [WavesTxActions.WAVES_TX_STATUS]: (state) => ({
    ...state,
  }),

  [WavesTxActions.WAVES_TX_UPDATE]: (state) => ({
    ...state,
  }),
}

export default (state = initialState(), { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
