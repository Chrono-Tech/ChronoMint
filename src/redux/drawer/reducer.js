/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import * as actions from './constants'

const initialState = {
  isOpen: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case actions.DRAWER_TOGGLE:
      return {
        ...action.payload,
        isOpen: !state.isOpen,
      }
    case actions.DRAWER_HIDE:
      return {
        ...action.payload,
        isOpen: false,
      }
    default:
      return state
  }
}
