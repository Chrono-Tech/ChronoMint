/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const OPEN_BRAND_PARTIAL = 'ui/OPEN_BRAND_PARTIAL'
const initialState = {
  open: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case OPEN_BRAND_PARTIAL:
      return {
        ...state,
        open: action.payload.open,
      }
    default:
      return state
  }
}
