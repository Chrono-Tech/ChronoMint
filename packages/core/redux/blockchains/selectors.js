/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_BLOCKCHAINS } from './constants'

export const getBlockchainsList = (state) => {
  return state.get(DUCK_BLOCKCHAINS).list || []
}
