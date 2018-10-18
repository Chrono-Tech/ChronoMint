/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_BLOCKCHAINS } from './constants'

export const getBlockchains = (state) => {
  return state.get(DUCK_BLOCKCHAINS).list || []
}

export const getBlockchainsList = (state) => {
  return getBlockchains(state).list || []
}
