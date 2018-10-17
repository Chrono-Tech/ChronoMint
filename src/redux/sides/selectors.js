/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { DUCK_SIDES } from './constants'

export const getSelectedBlockchain = (state) => {
  const { selectedBlockchain } = state.get(DUCK_SIDES)
  return selectedBlockchain
}
