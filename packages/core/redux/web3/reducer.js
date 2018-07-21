/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const WEB3_SETUP = 'Web3/setup'

export default (state = null, action) => {
  switch (action.type) {
    case WEB3_SETUP:
      return action.web3
    default:
      return state
  }
}
