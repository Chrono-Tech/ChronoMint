/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokensCollection from '@chronobank/core/models/tokens/TokensCollection'
import * as a from './constants'

const initialState = new TokensCollection()

export default (state = initialState, action) => {
  switch (action.type) {
    case a.LOAD_INIT:
      return state.isInited(action.isInited)
    case a.I18N_LOADED:
      return { ...state, list: action.payload.list }
    default:
      return state
  }
}
