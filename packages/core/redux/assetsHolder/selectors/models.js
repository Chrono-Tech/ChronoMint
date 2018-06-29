/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { DUCK_ASSETS_HOLDER } from '../actions'

//#region SIMPLE SELECTORS
export const getAssetsHolderAssets = (state) => {
  return state.get(DUCK_ASSETS_HOLDER).assets()
}
//#endregion
