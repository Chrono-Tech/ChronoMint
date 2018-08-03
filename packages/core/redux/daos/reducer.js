/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  DAOS_REGISTER,
  DAOS_INITIALIZED,
} from './constants'

export const initialState = {
  byType: {},
  byAddress: {},
  isInitialized: false,
}

const mutations = {
  [DAOS_REGISTER] (state, { model }) {
    return {
      ...state,
      byType: {
        ...state.byType,
        [model.contract.type]: model,
      },
      byAddress: {
        ...state.byAddress,
        [model.address]: model,
      },
    }
  },
  [DAOS_INITIALIZED] (state, { isInitialized }) {
    return {
      ...state,
      isInitialized,
    }
  },
}

export default (state = initialState, { type, ...other }) => {
  return (type in mutations)
    ? mutations[type](state, other)
    : state
}
