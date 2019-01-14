/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import {
  WEB3_UPDATE,
} from './constants'

const initialState = () => ({
  web3: null,
})

const mutations = {
  [WEB3_UPDATE]: (state, { web3 }) => ({
    ...state,
    web3,
  }),
}

export default (state = initialState(), { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
