/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as NodesActionTypes from './constants'
// import * as NodesActions from './actions'
// import * as NodesSelectors from './selectors'
import initialState from './initialState'

const mutations = {

  [NodesActionTypes.NODES_NETWORK_SELECT]: (state, { networkIndex }) => {
    return {
      ...state,
      selected: state.availableNetworks[networkIndex],
    }
  },

}

export default (state = initialState, { type, ...payload }) => {
  return (type in mutations)
    ? mutations[type](state, payload)
    : state
}
