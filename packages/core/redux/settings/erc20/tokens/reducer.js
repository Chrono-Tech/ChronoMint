/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import TokenModel from '../../../../models/tokens/TokenModel'
import * as a from './constants'

const initialState = {
  selected: new TokenModel(),
  formFetching: false,
  isFetched: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case a.TOKENS_FORM:
      return {
        ...state,
        selected: action.token,
      }
    case a.TOKENS_FORM_FETCH:
      return {
        ...state,
        formFetching: !(action.end || false),
      }
    default:
      return state
  }
}
