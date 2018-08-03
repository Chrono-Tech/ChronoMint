/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ASSETS_MANAGER } from '../constants'

export const getSelectedTokenId = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).selectedToken()
}

export const getAssets = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).assets()
}

export const getPlatforms = (state) => {
  return state.get(DUCK_ASSETS_MANAGER).platformsList()
}
