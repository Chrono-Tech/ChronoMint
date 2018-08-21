/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */
import { DUCK_MARKET } from './constants'

export const getMarket = (state) => {
  return state.get(DUCK_MARKET)
}

